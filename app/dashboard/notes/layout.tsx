"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Notes</h1>
        <CreateNoteButton />
      </div>
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
    </main>
  );
}
