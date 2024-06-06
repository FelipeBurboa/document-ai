import {
  MutationCtx,
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";

import OpenAI from "openai";
import { Id } from "./_generated/dataModel";
import { embed } from "./notes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (document?.tokenIdentifier !== userId || !document) {
    return null;
  }

  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  handler(ctx, args) {
    return hasAccessToDocument(ctx, args.documentId);
  },
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return undefined;
    }

    return ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();
  },
});

export const getDocumentById = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return null;
    }

    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      return null;
    }

    return {
      ...accessObj.document,
      documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
    };
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id("_storage"),
  },

  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
      description: "",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDecomentDescription,
      {
        fileId: args.fileId,
        documentId,
      }
    );
  },
});

export const generateDecomentDescription = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },

  async handler(ctx, args) {
    const file = await ctx.storage.get(args.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Here is the document: ${text}`,
          },
          {
            role: "user",
            content: `Please generate 1 sentence description of the document. Keep it short as possible.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

    const description =
      chatCompletion.choices[0].message.content ??
      "I'm sorry, I couldn't generate a description for this document";

    const embedding = await embed(description);

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: description,
      embedding: embedding,
    });
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      embedding: args.embedding,
    });
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },

  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );

    if (!accessObj) {
      throw new ConvexError("You do not have access to this document");
    }

    const file = await ctx.storage.get(accessObj.document.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Here is the document: ${text}`,
          },
          {
            role: "user",
            content: `Please answer this question: ${args.question}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      tokenIdentifier: accessObj.userId,
      text: args.question,
      isHuman: true,
    });

    const response =
      chatCompletion.choices[0].message.content ??
      "Could not answer the question";

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      tokenIdentifier: accessObj.userId,
      text: response,
      isHuman: false,
    });

    return response;
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },

  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      throw new ConvexError("You do not have access to this document");
    }

    await ctx.storage.delete(accessObj.document.fileId);
    await ctx.db.delete(args.documentId);
  },
});
