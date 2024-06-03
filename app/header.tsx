"use client";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
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
        <div>
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
          <Authenticated>
            <div className="flex gap-5">
              <ModeToggle />
              <UserButton />
            </div>
          </Authenticated>
        </div>
      </div>
    </div>
  );
}
