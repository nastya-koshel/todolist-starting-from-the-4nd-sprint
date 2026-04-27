import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/app/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"

// Создание искусственной задержки: await new Promise((resolve) => setTimeout(resolve, 3000))

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  reducers: (create) => {
    return {
      // action creator
      changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
        const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
        if (task) {
          task.title = action.payload.title
        }
      }),

      //thunk creator
      fetchTasksTC: create.asyncThunk(async (todolistId: string, thunkAPI) => {
          //
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await tasksApi.getTasks(todolistId)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { tasks: res.data.items, todolistId }
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          }
        }),
      createTaskTC: create.asyncThunk(async (args: { todolistId: string, title: string }, thunkAPI) => {
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await tasksApi.createTask(args)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
          }
        }),
      deleteTaskTC: create.asyncThunk(async (args: { todolistId: string, taskId: string }, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            await tasksApi.deleteTask(args)
            return args
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          }
        }),
      changeTaskStatusTC: create.asyncThunk(async (task: DomainTask, { rejectWithValue, dispatch }) => {
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await tasksApi.updateTask(task)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
            if (task) {
              task.status = action.payload.task.status
            }
          }
        }),
      changeTaskTitleTC: create.asyncThunk(async (task: DomainTask, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask(task)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (e) {
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(e)
        }
      }, {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.title = action.payload.task.title
          }
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload]
      })
  },
  selectors: {
    selectTasks: (state) => state
  }
})

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, DomainTask[]>

export const { deleteTaskTC, changeTaskStatusTC, changeTaskTitleTC, fetchTasksTC, createTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
