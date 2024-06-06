import { v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return null;
    }

    const embedding = await embed(args.search);

    const notesResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("tokenIdentifier", userId),
    });

    const documentsResults = await ctx.vectorSearch(
      "documents",
      "by_embedding",
      {
        vector: embedding,
        limit: 5,
        filter: (q) => q.eq("tokenIdentifier", userId),
      }
    );

    const records: (
      | { type: "notes"; score: number; record: Doc<"notes"> }
      | { type: "documents"; score: number; record: Doc<"documents"> }
    )[] = [];

    await Promise.all(
      documentsResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocumentById, {
          documentId: result._id,
        });

        if (!document) {
          return;
        }
        records.push({
          record: document,
          score: result._score,
          type: "documents",
        });
      })
    );

    await Promise.all(
      notesResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });

        if (!note) {
          return;
        }
        records.push({
          record: note,
          score: result._score,
          type: "notes",
        });
      })
    );

    records.sort((a, b) => b.score - a.score);

    return records;
  },
});