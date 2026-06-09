import { instance } from "@/common/instance"
import { DomainTask, GetTasksResponse, TaskOperationResponse } from "@/features/todolists/api/tasksApi.types.ts"
import { DefaultResponse } from "@/common/types"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(task: DomainTask) {
    const {id, todoListId } = task
    return instance.put<TaskOperationResponse>(`/todo-lists/${todoListId}/tasks/${id}`, task)
  },
  deleteTask({ todolistId, taskId }: { todolistId: string; taskId: string }) {
    return instance.delete<DefaultResponse>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
