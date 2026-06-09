import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"
import * as z from "zod"
import { domainTaskSchema, getTasksSchema } from "@/features/todolists/model/schemas.ts"
import { baseResponseSchema } from "@/common/types"

// export type DomainTask = {
//   description: string
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: string
//   deadline: string
//   id: string
//   todoListId: string
//   order: number
//   addedDate: string
// }

export type DomainTask = z.infer<typeof domainTaskSchema>
export type GetTasksResponse = z.infer<typeof getTasksSchema>
export type TaskOperationResponse = z.infer<typeof taskOperationResponseSchema>

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}

export const taskOperationResponseSchema = baseResponseSchema(z.object({
  item: domainTaskSchema
})
)

