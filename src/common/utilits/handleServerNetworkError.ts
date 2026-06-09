import { Dispatch } from "@reduxjs/toolkit"
import axios from "axios"
import * as z from "zod"
import { changeErrorAC, changeStatusAC } from "@/app/model/app-slice.ts"

// export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
//   if (isAxiosError(error)) {
//     dispatch(changeErrorAC({error: error.response?.data?.error || error.message}))
//   } else if (error instanceof Error) {
//     dispatch(changeErrorAC({error: error.message}))
//   } else {
//     dispatch(changeErrorAC({error: "Something is wrong"}))
//   }
//   dispatch(changeStatusAC({status: "failed"}))
// }

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage

  switch (true) {
    case axios.isAxiosError(error):
      errorMessage = error.response?.data?.message || error.message
      break

    case error instanceof z.ZodError:
      console.table(error.issues)
      errorMessage = 'Zod error. Смотри консоль'
      break

    case error instanceof Error:
      errorMessage = `Native error: ${error.message}`
      break

    default:
      errorMessage = JSON.stringify(error)
  }

  dispatch(changeErrorAC({ error: errorMessage }))
  dispatch(changeStatusAC({ status: 'failed' }))
}

