"use client";

import { cn } from "@/lib/utils";
import { FilesIcon, NotebookTabs, SearchIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-6">
        <li>
          <Link
            className={cn(
              "flex gap-1 items-center text-xl hover:text-cyan-600",
              {
                "text-cyan-600 font-bold ": pathname.endsWith("/search"),
              }
            )}
            href="/dashboard/search"
          >
            <SearchIcon className="w-6 h-6" />
            Search
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex gap-1 items-center text-xl hover:text-cyan-600",
              {
                "text-cyan-600 font-bold ": pathname.endsWith("/documents"),
              }
            )}
            href="/dashboard/documents"
          >
            <FilesIcon className="w-6 h-6" />
            Documents
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex gap-1 items-center text-xl hover:text-cyan-600",
              {
                "text-cyan-600 font-bold ": pathname.endsWith("/notes"),
              }
            )}
            href="/dashboard/notes"
          >
            <NotebookTabs className="w-6 h-6" />
            Notes
          </Link>
        </li>
        {/*   <li>
          <Link
            className={cn(
              "flex gap-1 items-center text-xl hover:text-cyan-600",
              {
                "text-cyan-600 font-bold ": pathname.endsWith("/settings"),
              }
            )}
            href="/dashboard/settings"
          >
            <Settings className="w-6 h-6" />
            Settings
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}
