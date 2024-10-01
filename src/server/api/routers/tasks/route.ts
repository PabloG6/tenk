import { db } from "@/server/db";
import { authProcedure, createTRPCRouter } from "../../trpc";
import { TaskSchema } from "./types";
import { logs, tasks } from "@/server/db/schema";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";

export const tasksRouter = createTRPCRouter({
  create: authProcedure.input(TaskSchema).mutation(async ({ input }) => {
    const [result] = await db.insert(tasks).values(input).returning();
    return result;
  }),

  getByID: authProcedure.input(z.coerce.number()).query(async ({ input }) => {
    const results = await db.query.tasks.findFirst({
      where: (task, { eq }) => eq(task.id, input),
    });

    const returnLogs = await db.query.logs.findMany({
      where: (logs, { eq }) => eq(logs.taskID, input),
      orderBy: desc(logs.startTime),
    });

    return {
      name: results?.name,
      id: results?.id,
      description: results?.description,
      createdAt: results?.createdAt,
      updatedAt: results?.updatedAt,
      logs: returnLogs,
    };
  }),

  findAll: authProcedure
    .query(async ({ input }) => {

      return await db.query.tasks.findMany();
    }),
});
