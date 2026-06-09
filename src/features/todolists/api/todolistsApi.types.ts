import * as z from "zod"
import { todolistSchema } from "@/features/todolists/model/schemas.ts"

export type Todolist = z.infer<typeof todolistSchema>
export type CreateTodolistResponse = z.infer<typeof todolistSchema>

