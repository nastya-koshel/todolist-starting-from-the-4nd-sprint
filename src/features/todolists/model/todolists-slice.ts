import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { TodolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/app/createAppSlice.ts"

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
      //thunk creator
      fetchTodolistsTC: create.asyncThunk(async (_arg, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            const res = await TodolistsApi.getTodolists()
            return res.data
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (_state, action) => {
            return action.payload.map((tl) => ({ ...tl, filter: "all" }))
          }
        }),
      changeTodolistTitleTC: create.asyncThunk(async (args: {
          id: string,
          title: string
        }, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            await TodolistsApi.changeTodolistTitle(args.id, args.title)
            return args
          } catch (e) {
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
          const { rejectWithValue } = thunkAPI
          try {
            const res = await TodolistsApi.createTodolist(title)
            const newTodolist: DomainTodolist = {
              ...res.data.data.item,
              filter: "all"
            }
            return newTodolist
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            state.push(action.payload)
          }
        }),
      deleteTodolistTC: create.asyncThunk (async (id: string, thunkAPI) => {
        const { rejectWithValue } = thunkAPI
        try {
          await TodolistsApi.deleteTodolist(id)
          return id
        } catch (e) {
          return rejectWithValue(e)
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
  fetchTodolistsTC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC
} = todolistsSlice.actions

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
