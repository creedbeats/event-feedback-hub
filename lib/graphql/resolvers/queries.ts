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
    events: () => {
      return db.select().from(schema.events).all();
    },

    event: (_: unknown, { id }: { id: string }) => {
      return db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, id))
        .get();
    },

    feedback: (
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

      const items = db
        .select()
        .from(schema.feedback)
        .where(whereClause)
        .orderBy(desc(schema.feedback.createdAt))
        .limit(pageSize)
        .offset(offset)
        .all();

      const totalResult = db
        .select({ count: count() })
        .from(schema.feedback)
        .where(whereClause)
        .get();

      const totalCount = totalResult?.count ?? 0;
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
    feedback: (event: { id: string }) => {
      return db
        .select()
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id))
        .orderBy(desc(schema.feedback.createdAt))
        .all();
    },

    feedbackCount: (event: { id: string }) => {
      const result = db
        .select({ count: count() })
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id))
        .get();
      return result?.count ?? 0;
    },

    averageRating: (event: { id: string }) => {
      const result = db
        .select({ avg: avg(schema.feedback.rating) })
        .from(schema.feedback)
        .where(eq(schema.feedback.eventId, event.id))
        .get();
      return result?.avg ? parseFloat(result.avg) : null;
    },
  },

  Feedback: {
    event: (feedback: { eventId: string }) => {
      return db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, feedback.eventId))
        .get();
    },
  },
};
