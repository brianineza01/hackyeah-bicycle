import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types, Router, F
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from openai import AsyncOpenAI
from jinja2 import Environment, FileSystemLoader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_api_key = os.getenv('OPENAI_API_KEY')
client = AsyncOpenAI(api_key=openai_api_key)
MODEL_CHAT = "gpt-4o-mini"
MODEL_IMAGE = "dall-e-3"

# Bot and Dispatcher setup
TOKEN = os.getenv('YOUR_BOT_TOKEN')
bot = Bot(token=TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher(storage=MemoryStorage())
router = Router()
dp.include_router(router)

# Template engine setup
env = Environment(loader=FileSystemLoader('templates'))
btc_wallet = "1P9V5CyAgqfQeEgkYeJ7Kr7ursq37EkMjP"

# Custom Logging Middleware
class LoggingMiddleware:
    async def __call__(self, handler, event, data):
        loop = asyncio.get_running_loop()
        start_time = loop.time()
        handled = False
        try:
            result = await handler(event, data)
            handled = result is not None
            return result
        finally:
            duration = (loop.time() - start_time) * 1000
            logging.info(
                "Update id=%s is %s. Duration %d ms by bot id=%d",
                event.update_id,
                "handled" if handled else "not handled",
                duration,
                data["bot"].id,
            )

# Model
class Brand:
    def __init__(self, name):
        self.attributes = {}
        self.attributes['name'] = name  # Set the brand name based on user's Telegram username

    def set_attribute(self, attr_name, attr_value):
        self.attributes[attr_name] = attr_value

    def get_attribute(self, attr_name):
        return self.attributes.get(attr_name, "Not specified")

class Persona:
    def __init__(self, user_id, username, first_name):
        self.user_id = user_id
        self.username = username
        self.first_name = first_name
        self.hidden_truths = []

    def uncover_truths_prompt(self, brand):
        return (
            f"As an expert in brand personas, analyze the persona '{self.username}', "
            f"who plays the role of '{self.first_name}' in AiMe. "
            f"Considering the brand attributes: {brand.attributes}, uncover valuable but hidden truths about this persona."
        )

# View
class BrandView:
    def __init__(self, bot):
        self.bot = bot

    def create_markup(self, buttons):
        inline_keyboard = []
        for i in range(0, len(buttons), 2):
            row = buttons[i:i+2]
            inline_keyboard.append([InlineKeyboardButton(text=button[0], callback_data=button[1]) for button in row])
        return InlineKeyboardMarkup(inline_keyboard=inline_keyboard)

    async def send_message_with_markup(self, message: types.Message, text: str, buttons: list):
        await message.answer(text, reply_markup=self.create_markup(buttons))

    async def send_welcome(self, message: types.Message):
        logger.info("Sending welcome message")
        await self.send_message_with_markup(
            message, 
            "🌟 Welcome to AiMe AI Agency! 🌟\nWe're here to help you achieve your brand goals with a sprinkle of playful roasts. Let's get started!\nPlease choose one of the options below to proceed:\n", 
            [("📝 Create Brand", "create_brand"), ("🔍 View Brand", "view_brand"), ("📅 Get Daily Quest", "get_daily_quest"), ("ℹ️ Help", "help")]
        )

    async def send_roasting_options(self, message: types.Message):
        logger.info("Sending roasting options")
        await self.send_message_with_markup(
            message,
            "🔥 Choose a roasting style to get personalized insights for your brand:",
            [("Strategy Roast", "roast_strategy"), ("Creative Roast", "roast_creative"), ("Production Roast", "roast_production"), ("Media Roast", "roast_media")]
        )

# Roasting Roles
class RoastingRole:
    def __init__(self, client, model, image_model):
        self.client = client
        self.model = model
        self.image_model = image_model

    async def get_ai_response(self, system_content, user_content):
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": user_content}
                ],
                max_tokens=200,
                temperature=0.7,
            )
            logger.info(f"Generated AI response: {response.choices[0].message.content.strip()}")
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI API error in get_ai_response: {e}")
            return "An error occurred while generating the roasting response."

    async def generate_image(self, image_prompt):
        try:
            response = await self.client.images.generate(
                model=self.image_model,
                prompt=image_prompt,
                n=1,
                size="1024x1024",
                response_format="url"
            )
            logger.info(f"Generated image URL: {response.data[0].url}")
            return response.data[0].url
        except Exception as e:
            logger.error(f"OpenAI DALL-E API error in generate_image: {e}")
            return "Image generation failed."

class StrategyRole(RoastingRole):
    async def execute(self, persona, brand):
        prompt = (
            f"Persona '{persona.username}' plays the role of '{persona.first_name}' in AiMe, and they want to build a brand called '{brand.get_attribute('name')}' that reflects their true self. "
            f"Given the brand attributes: {brand.attributes}, generate a strategic insight that dives deep into the hidden truths about what this persona truly desires. "
            f"Feel free to roast them a little along the way!"
        )
        response_text = await self.get_ai_response(
            "You are a branding strategist who uncovers hidden truths and does so with a playful roasting tone.",
            prompt
        )
        image_prompt = f"An artistic representation of the brand '{brand.get_attribute('name')}', reflecting its mission and values in a strategic context."
        image_url = await self.generate_image(image_prompt)
        return f"{response_text}\n\n![Brand Image]({image_url})"

class CreativeRole(RoastingRole):
    async def execute(self, persona, brand):
        prompt = (
            f"Persona '{persona.username}' sees themselves as a creative force, and they want their brand '{brand.get_attribute('name')}' to reflect that. "
            f"Using the brand attributes: {brand.attributes}, generate a creative idea that highlights their unique traits while challenging their current approach. "
            f"Give them a light-hearted roast to keep it fun!"
        )
        response_text = await self.get_ai_response(
            "You are a creative director who pushes personas to new creative heights with a playful roasting tone.",
            prompt
        )
        image_prompt = f"An imaginative and creative visual representation of the brand '{brand.get_attribute('name')}', capturing its essence in a bold and innovative way."
        image_url = await self.generate_image(image_prompt)
        return f"{response_text}\n\n![Brand Image]({image_url})"

class ProducingRole(RoastingRole):
    async def execute(self, persona, brand):
        prompt = (
            f"Persona '{persona.username}' wants to produce content under the brand '{brand.get_attribute('name')}' that resonates with their audience. "
            f"Given the brand attributes: {brand.attributes}, develop a production plan that encourages them to take bigger risks and explore new potential. "
            f"Don't forget to add a bit of a roast to keep them on their toes!"
        )
        response_text = await self.get_ai_response(
            "You are a content producer who inspires bold content strategies with a playful roast.",
            prompt
        )
        image_prompt = f"A dynamic and bold visual that represents the content production strategy of the brand '{brand.get_attribute('name')}', with elements of risk-taking and innovation."
        image_url = await self.generate_image(image_prompt)
        return f"{response_text}\n\n![Brand Image]({image_url})"

class MediaRole(RoastingRole):
    async def execute(self, persona, brand):
        prompt = (
            f"Persona '{persona.username}' thinks they know where their audience is for their brand '{brand.get_attribute('name')}', but let's challenge that assumption. "
            f"Given the brand attributes: {brand.attributes}, create a media strategy that explores new and unexpected channels. "
            f"And of course, give them a little roast while you're at it!"
        )
        response_text = await self.get_ai_response(
            "You are a media strategist who finds hidden audience gems with a playful roasting tone.",
            prompt
        )
        image_prompt = f"A creative media strategy visual for the brand '{brand.get_attribute('name')}', exploring unconventional channels and hidden audience segments."
        image_url = await self.generate_image(image_prompt)
        return f"{response_text}\n\n![Brand Image]({image_url})"

# Controller
class BrandController:
    def __init__(self, bot, dp, client):
        self.bot = bot
        self.dp = dp
        self.client = client
        self.brand_view = BrandView(bot)
        self.strategy_role = StrategyRole(client, MODEL_CHAT, MODEL_IMAGE)
        self.creative_role = CreativeRole(client, MODEL_CHAT, MODEL_IMAGE)
        self.producing_role = ProducingRole(client, MODEL_CHAT, MODEL_IMAGE)
        self.media_role = MediaRole(client, MODEL_CHAT, MODEL_IMAGE)

    def register_handlers(self):
        self.dp.message.register(self.start_command, F.text == "/start")
        self.dp.message.register(self.handle_create_brand, F.text == "📝 Create Brand")
        self.dp.callback_query.register(self.handle_callback_query, F.data.in_({"roast_strategy", "roast_creative", "roast_production", "roast_media"}))
        # Fallback handler for any unhandled updates
        self.dp.message.register(self.unhandled_message)

    async def start_command(self, message: types.Message):
        logger.info("Start command triggered")
        await self.brand_view.send_welcome(message)

    async def handle_create_brand(self, message: types.Message):
        logger.info("Handle create brand triggered")
        await message.answer("Brand creation started... (Implement the brand creation logic here)")
        await self.brand_view.send_roasting_options(message)

    async def handle_callback_query(self, callback_query: CallbackQuery):
        logger.info(f"Callback query received: {callback_query.data}")
        user_id = callback_query.from_user.id
        username = callback_query.from_user.username
        first_name = callback_query.from_user.first_name
        brand = Brand(name=username)  # Set the brand name as the user's Telegram username
        persona = Persona(user_id=user_id, username=username, first_name=first_name)

        if callback_query.data == "roast_strategy":
            response = await self.strategy_role.execute(persona, brand)
        elif callback_query.data == "roast_creative":
            response = await self.creative_role.execute(persona, brand)
        elif callback_query.data == "roast_production":
            response = await self.producing_role.execute(persona, brand)
        elif callback_query.data == "roast_media":
            response = await self.media_role.execute(persona, brand)
        else:
            response = "Invalid choice."

        await callback_query.message.answer(response)
        await callback_query.answer()

    async def unhandled_message(self, message: types.Message):
        logger.warning(f"Unhandled message received: {message.text}")
        await message.answer("Sorry, I didn't understand that command. Please use the provided options.")

# Bot entry point
async def main():
    load_dotenv()
    bot_token = os.getenv('YOUR_BOT_TOKEN')
    bot = Bot(token=bot_token, parse_mode=ParseMode.HTML)
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)
    dp.update.middleware(LoggingMiddleware())  # Add logging middleware
    controller = BrandController(bot, dp, client)
    controller.register_handlers()
    logger.info("Starting bot polling")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
