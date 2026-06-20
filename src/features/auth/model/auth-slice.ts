import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utilits"
import { LoginInputs } from "@/features/auth/lib/types.ts"
import { changeStatusAC } from "@/app/model/app-slice.ts"
import { authApi } from "@/features/auth/api/authApi.ts"
import { ResultCode } from "@/common/enums/enums.ts"
import { clearDataAC } from "@/common/actions"

export const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    login: ""
  },
  reducers: create => ({
    loginTC: create.asyncThunk(
      async (data: LoginInputs, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.login(data)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            localStorage.setItem("token", res.data.data.token)
            const resMe = await authApi.me()
            return {isLoggedIn: true, login: resMe.data.data.login}
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = action.payload.login
        }
      }
    ),
    logoutTC: create.asyncThunk(
      async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.logout()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            dispatch(clearDataAC())
            localStorage.removeItem("token")
            return { isLoggedIn: false, login: "" }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = action.payload.login
        }
      }
    ),
    meTC: create.asyncThunk(async (_, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        try {
          dispatch(changeStatusAC({ status: "loading" }))
          const res = await authApi.me()
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { isLoggedIn: true, login: res.data.data.login }
          } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleServerNetworkError(error, dispatch)
          dispatch(changeStatusAC({ status: "failed" }))
          return rejectWithValue(error)
        }
      }, {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
          state.login = action.payload.login
        }
      }
    )
  }),
  selectors: {
    selectIsLoginIn: (state) => state.isLoggedIn,
    selectLogin: (state) => state.login
  }
})

export const { selectIsLoginIn, selectLogin } = authSlice.selectors
export const authReducer = authSlice.reducer
export const { loginTC, logoutTC, meTC } = authSlice.actions

