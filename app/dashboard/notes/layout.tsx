"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organization = useOrganization();
  const notes = useQuery(api.notes.getNotes, {
    orgId: organization.organization?.id,
  });
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Notes</h1>
        <CreateNoteButton />
      </div>

      {!notes && (
        <div className="flex gap-8">
          <Card className="p-4 flex flex-col justify-between h-[300px] w-[200px]">
            <Skeleton className="h-[20px] rounded-sm" />
            <Skeleton className="h-[20px] rounded-sm" />
            <Skeleton className="h-[20px] rounded-sm" />
            <Skeleton className="h-[20px] rounded-sm" />
            <Skeleton className="h-[20px] rounded-sm" />
            <Skeleton className="h-[20px] rounded-sm" />
          </Card>
          <Card className="p-4 flex flex-col justify-between h-[400px] w-full">
            <Skeleton className="h-[30px] rounded-sm w-[30px] ml-auto" />
            <Skeleton className="h-[30px] rounded-sm" />
            <Skeleton className="h-[30px] rounded-sm" />
            <Skeleton className="h-[30px] rounded-sm" />
            <Skeleton className="h-[30px] rounded-sm" />
            <Skeleton className="h-[30px] rounded-sm" />
          </Card>
        </div>
      )}

      {notes && notes.length === 0 && (
        <div className="flex flex-col items-center gap-8 pt-20">
          <Image
            src="/document.svg"
            alt="No documents picture"
            width="200"
            height="200"
          />
          <p className="text-center text-2xl font-semibold">No notes yet</p>
        </div>
      )}

      {notes && notes.length > 0 && (
        <div className="flex gap-8">
          <ul className="space-y-2 w-[200px]">
            {notes?.map((note) => (
              <li
                key={note._id}
                className={cn("text-md hover:text-emerald-700", {
                  "font-semibold text-emerald-900 hover:text-emerald-900":
                    note._id === noteId,
                })}
              >
                <Link href={`/dashboard/notes/${note._id}`}>
                  {note.text.substring(0, 25) + "..."}
                </Link>
              </li>
            ))}
          </ul>
          <div className="w-[2px] bg-emerald-900 rounded-2xl"></div>
          <div className="bg-slate-900 p-4 rounded w-full text-slate-200 text-sm">
            {children}
          </div>
        </div>
      )}
    </main>
  );
}
