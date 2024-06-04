"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  return (
    <div className="w-full bg-gray-900 flex flex-col gap-2 p-4 rounded-xl">
      <div className="h-[350px] overflow-y-auto space-y-4 pr-3">
        <div className="bg-slate-700 rounded p-2 text-slate-300 text-center">
          Using AI ask any question about this document below
        </div>
        <div className="h-[2px] bg-slate-500 w-full rounded"></div>
        {chats?.map((chat) => (
          <div
            key={chat._id}
            className={cn(
              {
                "bg-slate-800": chat.isHuman,
                "text-right": chat.isHuman,
                "bg-slate-950": !chat.isHuman,
              },
              "rounded p-3 whitespace-pre-wrap"
            )}
          >
            {chat.isHuman ? "You" : "AI"}: {chat.text}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
