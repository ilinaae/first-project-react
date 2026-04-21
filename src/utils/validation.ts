import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Введите корректный email.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
})

export const registerSchema = z.object({
  email: z.email('Введите корректный email.'),
  name: z.string().min(2, 'Укажите имя длиной не менее 2 символов.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
  phone: z.string().min(10, 'Укажите телефон для связи.'),
})
