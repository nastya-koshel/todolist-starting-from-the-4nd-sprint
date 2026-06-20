import { instance } from "@/common/instance"
import { LoginInputs } from "src/features/auth/lib/types.ts"
import { BaseResponse } from "@/common/types"

export const authApi = {
  login (data: LoginInputs) {
    return instance.post<BaseResponse<{userId: number, token: string}>>("/auth/login", data)
  },
  logout () {
    return instance.delete<BaseResponse>("/auth/login")
  },
  me(){
    return instance.get<BaseResponse<{id: number, email: string, login: string}>>("/auth/me")
  }
}

