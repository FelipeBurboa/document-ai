"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import UploadDocumentButton from "./upload-document-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>

      {documents && documents.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {documents?.map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>
      )}

      {!documents && (
        <div className="grid grid-cols-3 gap-8">
          {new Array(8).fill(0).map((_, i) => (
            <Card className="p-4 flex flex-col justify-between h-[200px]">
              <Skeleton className="h-[20px] rounded-sm" />
              <Skeleton className="h-[20px] rounded-sm" />
              <Skeleton className="h-[20px] rounded-sm" />
              <Skeleton className="w-[40px] h-[30px] rounded-sm" />
            </Card>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <div className="flex flex-col items-center gap-8 pt-20">
          <Image
            src="/document.svg"
            alt="No documents picture"
            width="200"
            height="200"
          />
          <p className="text-center text-2xl font-semibold">
            No documents found
          </p>
        </div>
      )}
    </main>
  );
}
