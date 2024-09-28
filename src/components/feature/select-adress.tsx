"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import debounce from "lodash.debounce";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Address {
    display_name: string
    place_id: number
    boundingbox: string[]
}

export function SelectAdress({ onSelect }: { onSelect: (value: Address) => void }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [addresses, setAddresses] = React.useState<Address[]>([])
    const [loading, setLoading] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const searchAddresses = React.useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setAddresses([])
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                console.log(query)
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        query
                    )}&limit=10`
                )
                const data = await response.json()
                console.log(data)
                setAddresses(data)
            } catch (error) {
                console.error("Error fetching addresses:", error)
                setAddresses([])
            } finally {
                setLoading(false)
            }
        }, 300),
        []
    )

    React.useEffect(() => {
        searchAddresses(inputValue)
    }, [inputValue, searchAddresses])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between truncate"
                >
                    {value || "Search for an address..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search for an address..."
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>

                        {loading && <CommandEmpty>
                            {loading ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2">Searching...</span>
                                </div>
                            ) : inputValue.length > 0 ? (
                                "No address found."
                            ) : (
                                "Type to search for addresses."
                            )}
                        </CommandEmpty>}
                        <CommandGroup>
                            {/* FIXME: I dont know why it only renders 2 items when there are actually 4 */}
                            {addresses.map((address) => (
                                <CommandItem
                                    key={address.place_id}
                                    value={address.display_name}
                                    onSelect={(currentValue) => {
                                        onSelect(address)

                                        setValue(currentValue === value ? "" : currentValue)
                                        setInputValue("")
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === address.display_name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {address.display_name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}