import * as z from "zod"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"
import { baseResponseSchema } from "@/common/types"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.iso.datetime({local: true}),
})

export const getTasksSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: domainTaskSchema.array()
})

export const todolistSchema = z.object({
  id: z.string(),
  addedDate: z.iso.datetime({local: true}),
  order: z.number(),
  title: z.string(),
})

export const createTodolistResponseSchema = baseResponseSchema(z.object({
    item: todolistSchema
  })
)


