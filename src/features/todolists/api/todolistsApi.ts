import { instance } from "@/common/instance/instance.ts"
import { DefaultResponse } from "@/common/types"
import { CreateTodolistResponse, Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const TodolistsApi = {
  getTodolists: () => {
    return instance.get<Todolist[]>("https://social-network.samuraijs.com/api/1.1/todo-lists")
  },
  createTodolist: (title: string) => {
    return instance.post<CreateTodolistResponse>("/todo-lists", { title })
  },
  deleteTodolist: (id: string) => {
    return instance.delete<DefaultResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle: (id: string, title: string) => {
    return instance.put<DefaultResponse>(`/todo-lists/${id}`, { title })
  },
}
