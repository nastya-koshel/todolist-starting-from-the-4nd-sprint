import * as z from "zod"

export const loginSchema = z.object({
  email: z.email({ error: 'Incorrect email address' }),
  password: z.string().min(4),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(),
})

