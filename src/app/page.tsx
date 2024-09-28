import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SelectAdress } from "./components/select-adress";
import { Label } from "@/components/ui/label";
import { CyclistMap } from "./components/cyclist-map";
import { CyclistComponent } from "./components/cyclist-component";

export default function Home() {
  return (
    <div>
      <CyclistComponent />

    </div>
  );
}
