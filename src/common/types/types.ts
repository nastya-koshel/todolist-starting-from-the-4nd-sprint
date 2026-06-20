import * as z from "zod"
import { ResultCode } from "@/common/enums/enums.ts"

export type FieldError = z.infer<typeof fieldErrorSchema>
// export type BaseResponse = z.infer<typeof baseResponseSchema>
export type DefaultResponse = z.infer<typeof defaultResponseSchema>

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string()
})

export const baseResponseSchema = <T extends z.ZodTypeAny>(schema: T) => z.object({
  data: schema,
  resultCode: z.enum(ResultCode),
  messages: z.string().array(),
  fieldsErrors: fieldErrorSchema.array()
})

export type BaseResponse<T = {}> = {
  data: T
  resultCode: ResultCode
  messages: string[]
  fieldsErrors: FieldError[]
}

export const defaultResponseSchema = baseResponseSchema(z.object({}))

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'