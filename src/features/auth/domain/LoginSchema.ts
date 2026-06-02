import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Usuário é obrigatório')
    .email('Usuário deve ser um e-mail corporativo válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormInput = z.infer<typeof LoginFormSchema>;
