import { db, schema } from "@/lib/db";
import { eq, and, gte, lte, count, avg, desc } from "drizzle-orm";

interface FeedbackFilterInput {
  eventId?: string;
  minRating?: number;
  maxRating?: number;
}

interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export const queryResolvers = {
  Query: {
    events: async () => {
      return await db.select().from(schema.events);
    },

    event: async (_: unknown, { id }: { id: string }) => {
      const results = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, id));
      return results[0] ?? null;
    },

    feedback: async (
      _: unknown,
      {
        filter,
        pagination,
      }: { filter?: FeedbackFilterInput; pagination?: PaginationInput }
    ) => {
      const page = pagination?.page ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const offset = (page - 1) * pageSize;

      const conditions = [];

      if (filter?.eventId) {
        conditions.push(eq(schema.feedback.eventId, filter.eventId));
      }
      if (filter?.minRating) {
        conditions.push(gte(schema.feedback.rating, filter.minRating));
      }
      if (filter?.maxRating) {
        conditions.push(lte(schema.feedback.rating, filter.maxRating));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(schema.feedback)
        .where(whereClause)
        .orderBy(desc(schema.feedback.createdAt))
        .limit(pageSize)
        .offset(offset);

      const totalResult = await db
        .select({ count: count() })
        .from(schema.feedback)
        .where(whereClause);

      const totalCount = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        totalCount,
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          currentPage: page,
          totalPages,
        },
      };
    },
  },

  Event: {
    feedback: async (event: { id: string }) => {
      return await db
        .select()
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id))
        .orderBy(desc(schema.feedback.createdAt));
    },

    feedbackCount: async (event: { id: string }) => {
      const result = await db
        .select({ count: count() })
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id));
      return result[0]?.count ?? 0;
    },

    averageRating: async (event: { id: string }) => {
      const result = await db
        .select({ avg: avg(schema.feedback.rating) })
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id));
      return result[0]?.avg ? parseFloat(result[0].avg) : null;
    },
  },

  Feedback: {
    event: async (feedback: { eventId: string }) => {
      const results = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, feedback.eventId));
      return results[0] ?? null;
    },
  },
};
