import { z } from "zod";

export const TaskSchema = z.object({
    name: z.string(),
    description: z.string()
});


export const SelectTaskSchema = TaskSchema.merge(z.object({id: z.coerce.number(), createdAt: z.coerce.date().nullish(), updatedAt: z.coerce.date().nullish()}))
export type TaskType = z.infer<typeof TaskSchema>;
export type SelectTaskType = z.infer<typeof SelectTaskSchema>;