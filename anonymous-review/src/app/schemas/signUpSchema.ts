// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from 'zod'
export const usernameValidation = z
.string()
.min(2,'username must be at least 2 characters long')
.max(20,'username must be at least 20 characters long')
.regex(/^[a-zA-Z0-9_]+$/,'username must not contain any special characters')

export const signUpSchema = z.object({
 username: usernameValidation,
 email:z.string().email({message:"Invalid email address"}),
 password: z.string().min(6,{message:"must be at least 6 characters"},)
})