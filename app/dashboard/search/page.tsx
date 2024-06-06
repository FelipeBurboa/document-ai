"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import { FilesIcon, NotebookTabs } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (!storedResults) return;
    setResults(JSON.parse(storedResults));
  }, []);

  return (
    <main className="w-full space-y-8 pb-3">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Search</h1>
      </div>
      <SearchForm
        setResults={(searchResults) => {
          setResults(searchResults);
          localStorage.setItem("searchResults", JSON.stringify(searchResults));
        }}
      />
      <ul className="flex flex-col gap-4 text-slate-100">
        {results?.map((result) => {
          if (result.type === "notes") {
            return (
              <Link
                href={`/dashboard/notes/${result.record._id}`}
                key={result.record._id}
              >
                <li className="hover:bg-slate-700 bg-slate-800 rounded p-4 whitespace-pre-line">
                  <div className="flex gap-2 items-center justify-between mb-2">
                    <NotebookTabs className="w-5 h-5 mb-1 text-emerald-500" />
                    <p className="font-bold text-emerald-500">Notes</p>
                    <p className=" text-emerald-500 font-semibold text-sm -mr-2 -mt-6">
                      Score: {result.score.toPrecision(4)}
                    </p>
                  </div>
                  {result.record.text.substring(0, 500) + "..."}
                </li>
                <div className="h-[2px] bg-emerald-500 w-full rounded"></div>
              </Link>
            );
          } else {
            return (
              <Link
                href={`/dashboard/documents/${result.record._id}`}
                key={result.record._id}
              >
                <li className="hover:bg-slate-700 bg-slate-800 rounded p-4 whitespace-pre-line">
                  <div className="flex gap-2 items-center justify-between mb-2">
                    <FilesIcon className="w-5 h-5 text-orange-400" />
                    <p className="font-bold text-orange-400">Documents</p>
                    <p className="text-orange-400 font-semibold text-sm -mr-2 -mt-6">
                      <span>Score:</span> {result.score.toPrecision(4)}
                    </p>
                  </div>
                  {result.record.description}
                </li>
                <div className="h-[2px] bg-orange-400 w-[99.9%] rounded-b-xl mx-auto"></div>
              </Link>
            );
          }
        })}
      </ul>
    </main>
  );
}
