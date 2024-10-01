import { authProcedure, createTRPCRouter } from "@/server/api/trpc";
import { InsertLogSchema, UpdateLogEntrySchema } from "./types";
import { db } from "@/server/db";
import { logs } from "@/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const logsRouter = createTRPCRouter({
  create: authProcedure.input(InsertLogSchema).mutation(async ({input}) => {

    const [results] = await db.insert(logs).values({startTime: input.startTime, taskID: input.taskID}).returning();
    return results;
  }),
  update: authProcedure.input(UpdateLogEntrySchema).mutation(async ({input}) => {

    const [results] = await db.update(logs).set({endTime: input.time}).where(eq(logs.id, input.id)).returning();
    return results;
  }),


  
});
