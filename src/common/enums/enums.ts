// + используем как тип
// + не можем нечаянно переопределить
// - весят больше обычных объектов

// export const TaskStatusObj = {
//   New = 0,
//   InProgress = 1,
//   Completed = 2,
//   Draft = 3,
// } as const
//   export type TaskStatusObj = (typeof TaskStatusObj)[keyof typeof TaskStatusObj]

export enum TaskStatus {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriority {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export enum ResultCode {
  Success = 0,
  Error = 1,
  ErrorCapture = 10
}