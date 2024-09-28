import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SelectAdress } from "./components/select-adress";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div>
      {/* Map */}
      <div className="w-full h-full bg-slate-800 absolute">

      </div>
      {/* upper controller / input */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-4">
        <SelectAdress></SelectAdress>
        <SelectAdress></SelectAdress>
      </div>


      {/* lover controller  */}
      <div className="absolute bottom-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-4">
        Her we have some stfuff
      </div>

    </div>
  );
}
