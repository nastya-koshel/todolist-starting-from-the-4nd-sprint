import * as z from "zod"
import { loginSchema } from "src/features/auth/lib/schemas.ts"

export type LoginInputs = z.infer<typeof loginSchema>

