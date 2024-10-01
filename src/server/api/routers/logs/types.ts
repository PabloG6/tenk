import { z } from "zod";

export const InsertLogSchema = z.object({
  taskID: z.coerce.number(),
  startTime: z.date(),
  endTime: z.date().nullish(),
});

export const UpdateLogEntrySchema = z.object({
  id: z.coerce.number(),
  time: z.date(),
});
export type InsertLogType = z.infer<typeof InsertLogSchema>;

export const SelectLogSchema = InsertLogSchema.merge(
  z.object({ id: z.number() }),
);


export type SelectLogType = z.infer<typeof SelectLogSchema>;