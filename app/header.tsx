import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HeaderActions } from "./header-actions";
export function Header() {
  return (
    <div className="bg-slate-900 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 text-2xl">
          <Image
            src="/documentai.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          Document AI
        </div>
        <div className="flex gap-5 items-center">
          <HeaderActions />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
