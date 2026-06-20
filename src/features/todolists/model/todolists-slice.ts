import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { TodolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { defaultResponseSchema, RequestStatus } from "@/common/types"
import { changeStatusAC } from "@/app/model/app-slice.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { createAppSlice, handleServerNetworkError, handleServerAppError } from "@/common/utilits"
import { createTodolistResponseSchema, todolistSchema } from "@/features/todolists/model/schemas.ts"
import { clearDataAC } from "@/common/actions"


export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    return {
      // action creator
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
      changeTodolistEntityStatusAC: create.reducer<{ id: string; entityStates: RequestStatus }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.entityStatus = action.payload.entityStates
        }
      }),
      //thunk creator
      fetchTodolistsTC: create.asyncThunk(async (_arg, thunkAPI) => {
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await TodolistsApi.getTodolists()
            todolistSchema.array().parse(res.data)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolists: res.data }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (_state, action) => {
            return action.payload?.todolists.map((tl) => {
              return { ...tl, filter: "all", entityStatus: "idle" }
            })
          }
        }),
      changeTodolistTitleTC: create.asyncThunk(async (args: {
          id: string,
          title: string
        }, thunkAPI) => {
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await TodolistsApi.changeTodolistTitle(args.id, args.title)
            defaultResponseSchema.parse(res.data)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              return args
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          }
        }),
      createTodolistTC: create.asyncThunk(async (title: string, thunkAPI) => {
          const { rejectWithValue, dispatch } = thunkAPI

          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await TodolistsApi.createTodolist(title)
            console.log("Raw response:", res.data)
            const validated = createTodolistResponseSchema.parse(res.data)

            const newTodolist: DomainTodolist = {
              ...validated.data.item,
              filter: "all",
              entityStatus: "idle"
            }
            if (validated.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              return newTodolist
            } else {
              handleServerAppError(validated, dispatch)
              return rejectWithValue(null)
            }
          } catch (error: any) {
            handleServerNetworkError(error, dispatch)
            // dispatch(changeErrorAC({error: error.message}))
            // dispatch(changeStatusAC({status: "failed"}))
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            state.push(action.payload)
          }
        }),
      deleteTodolistTC: create.asyncThunk(async (id: string, thunkAPI) => {
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeTodolistEntityStatusAC({ id, entityStates: "loading" }))
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await TodolistsApi.deleteTodolist(id)
            defaultResponseSchema.parse(res.data)
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(changeStatusAC({ status: "succeeded" }))
              dispatch(changeTodolistEntityStatusAC({ id, entityStates: "idle" }))
              return id
            } else {
              handleServerAppError(res.data, dispatch)
              dispatch(changeTodolistEntityStatusAC({ id, entityStates: "failed" }))
              return rejectWithValue(null)
            }

          } catch (error: any) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(error)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }
        })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearDataAC, () => {
        return []
      })
  },
  // extraReducers: (builder) => {
  // builder
  // .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
  //   return action.payload.map((tl) => ({ ...tl, filter: "all" }))
  // })
  // .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
  //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
  //   if (index !== -1) {
  //     state[index].title = action.payload.title
  //   }
  // })
  // .addCase(createTodolistTC.fulfilled, (state, action) => {
  //   state.push(action.payload)
  // })
  // .addCase(deleteTodolistTC.fulfilled, (state, action) => {
  //   const index = state.findIndex((todolist) => todolist.id === action.payload)
  //   if (index !== -1) {
  //     state.splice(index, 1)
  //   }
  // })
  // },
  selectors: {
    selectTodolists: (state) => state
  }
})

// export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_arg, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//   try {
//     const res = await TodolistsApi.getTodolists()
//     return res.data
//   } catch (e) {
//     return rejectWithValue(e)
//   }
// })

// export const changeTodolistTitleTC = createAsyncThunk(`${todolistsSlice.name}/changeTodolistTitleTC`, async (args: {
//   id: string,
//   title: string
// }, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//   try {
//     await TodolistsApi.changeTodolistTitle(args.id, args.title)
//     return args
//   } catch (e) {
//     return rejectWithValue(e)
//   }
// })

// export const createTodolistTC = createAsyncThunk(`${todolistsSlice.name}/createTodolistTC`, async (title: string, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//   try {
//     const res = await TodolistsApi.createTodolist(title)
//     const newTodolist: DomainTodolist = {
//       ...res.data.data.item,
//       filter: "all"
//     }
//     return newTodolist
//   } catch (e) {
//     return rejectWithValue(e)
//   }
// })

// export const deleteTodolistTC = createAsyncThunk(`${todolistsSlice.name}/deleteTodolistTC`, async (id: string, thunkAPI) => {
//   const { rejectWithValue } = thunkAPI
//   try {
//     await TodolistsApi.deleteTodolist(id)
//     return id
//   } catch (e) {
//     return rejectWithValue(e)
//   }
// })

export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  fetchTodolistsTC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC
} = todolistsSlice.actions

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
