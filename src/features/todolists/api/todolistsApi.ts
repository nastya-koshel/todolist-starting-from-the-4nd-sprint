import { instance } from "@/common/instance/instance.ts"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { BaseResponse } from "@/common/types"

export const TodolistsApi = {
  getTodolists: () => {
    return instance.get<Todolist[]>("https://social-network.samuraijs.com/api/1.1/todo-lists")
  },
  createTodolist: (title: string) => {
    return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
  },
  deleteTodolist: (id: string) => {
    return instance.delete<BaseResponse>(`/todo-lists/${id}`)
  },
  changeTodolistTitle: (id: string, title: string) => {
    return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
  },
}
