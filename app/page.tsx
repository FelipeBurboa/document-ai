import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="px-6 pt-14">
        <div className="mx-auto max-w-2xl h-full py-10">
          <div className="text-center">
            <Image
              className="mx-auto mb-8"
              src="/document.svg"
              alt="Your Company"
              width={300}
              height={300}
            />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
              Take Control of your Team Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Document AI acts as your team's second brain, storing all your
              docs and allowing easy vector search.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <SignInButton>
                <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Get started
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
