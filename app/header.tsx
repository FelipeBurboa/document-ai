import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
export function Header() {
  return (
    <div className="z-10 relative bg-slate-50 py-4 dark:bg-slate-900 shadow">
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
          <nav className="flex gap-5">
            <OrganizationSwitcher />
            <Link href="/dashboard" className="hover:text-slate-300">
              Dashboard
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
