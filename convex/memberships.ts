import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { hasOrgAcess } from "./documents";

export const addUserIdToOrg = internalMutation({
  args: {
    userId: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("memberships", {
      userId: args.userId,
      orgId: args.orgId,
    });
  },
});

export const removeUserIdFromOrg = internalMutation({
  args: {
    userId: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_orgId_userId", (q) =>
        q.eq("orgId", args.orgId).eq("userId", args.userId)
      )
      .first();

    if (membership) {
      await ctx.db.delete(membership._id);
    }
  },
});

export const hasOrgAccessQuery = internalQuery({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    return await hasOrgAcess(ctx, args.orgId);
  },
});
