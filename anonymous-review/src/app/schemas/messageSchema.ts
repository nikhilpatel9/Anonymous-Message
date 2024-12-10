import {z} from 'zod'
export const MessageSchema =z.object({
    content: z
    .string()
    .min(10,{message: 'message is too short message length must be at least 10 characters'})
    .max(300,{message: 'message is too long message length must be at most 300 characters'})
}) 