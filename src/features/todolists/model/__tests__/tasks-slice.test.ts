import { beforeEach, expect, test } from "vitest"
import {
  deleteTaskTC, createTaskTC,
  tasksReducer, TasksState, changeTaskStatusTC, changeTaskTitleTC
} from "../tasks-slice"
import { TaskPriority, TaskStatus } from "@/features/todolists/api/tasksApi.types.ts"
import {
  createTodolistTC,
  deleteTodolistTC,
  FilterValues,
} from "@/features/todolists/model/todolists-slice.ts"
import { nanoid } from "@reduxjs/toolkit"

let startState: TasksState = {}

const taskDefaultValues = {
  description: "",
  deadline: "",
  addedDate: "",
  startDate: "",
  priority: TaskPriority.Low,
  order: 0
}

beforeEach(() => {
  startState = {
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues
      }
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        todoListId: "todolistId2",
        ...taskDefaultValues
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues
      }
    ]
  }
})

test("correct task should be deleted", () => {
  const todolistId = "todolistId2"
  const taskId = "2"
  const endState = tasksReducer(
    startState,
    deleteTaskTC.fulfilled({ todolistId, taskId }, "requestId", { todolistId, taskId }))
  expect(endState).toEqual({
    "todolistId1": [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        todoListId: "todolistId1",
        ...taskDefaultValues
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        todoListId: "todolistId1",
        ...taskDefaultValues
      }
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        ...taskDefaultValues
      }
    ]
  })
})

test("correct task should be created at correct array", () => {
  const todolistId = "todolistId2"
  const title = "juice"
  const newTasks = {
    task: {
      id: "someId",
      title: title,
      status: TaskStatus.New,
      todoListId: todolistId,
      ...taskDefaultValues
    }
  }

  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled(newTasks, "requestId", { todolistId, title })
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {
  const task = {
    id: "2",
    title: "JS",
    status: TaskStatus.Completed,
    todoListId: "todolistId1",
    ...taskDefaultValues
  }

  const newTask = {
    task: {
      id: "2",
      title: "JS",
      status: TaskStatus.InProgress,
      todoListId: "todolistId1",
      ...taskDefaultValues
    }
  }

  const endState = tasksReducer(
    startState,
    changeTaskStatusTC.fulfilled(newTask, "requestId", task)
  )

  expect(endState.todolistId1[1].status).toBe(TaskStatus.InProgress)
  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed)
})

test("correct task should change its title", () => {
  const task = {
    id: "2",
    title: "milk",
    status: TaskStatus.Completed,
    todoListId: "todolistId2",
    ...taskDefaultValues
  }

  const newTask = { task: {
    id: "2",
    title: "coffee",
    status: TaskStatus.Completed,
    todoListId: "todolistId2",
    ...taskDefaultValues
  }}

  const endState = tasksReducer(
    startState,
    changeTaskTitleTC.fulfilled(newTask, 'requestId', task)
  )

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const title = "New todolist"
  const newTodolist = { id: nanoid(), title: title, addedDate: "", order: 0, filter: "all" as FilterValues}
  const endState = tasksReducer(startState, createTodolistTC.fulfilled(newTodolist, 'requestId', title))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const todolistId = "todolistId2"
  const endState = tasksReducer(
    startState,
    deleteTodolistTC.fulfilled(todolistId, 'requestId', todolistId)
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState[todolistId]).not.toBeDefined()
  // or
  expect(endState[todolistId]).toBeUndefined()
})
