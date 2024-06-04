import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
export function Header() {
  return (
    <div className="bg-slate-500 py-4 dark:bg-slate-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-12 items-center">
          <Link href="/" className="flex items-center gap-4 text-2xl">
            <Image
              src="/documentai.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            Document AI
          </Link>
          <nav>
            <Link href="/" className="hover:text-slate-300">
              Documents{" "}
            </Link>
          </nav>
        </div>
        <div className="flex gap-5 items-center">
          <HeaderActions />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
