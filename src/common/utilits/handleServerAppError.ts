import { Dispatch } from "@reduxjs/toolkit"
import { changeErrorAC, changeStatusAC } from "@/app/model/app-slice.ts"
import { BaseResponse } from "@/common/types"

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch ) => {
  dispatch(changeStatusAC({status: "failed"}))
  const errorMessage = data.messages.length ? data.messages[0] : 'Something went wrong'
  dispatch(changeErrorAC({error: errorMessage}))
}

