import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { error: "Username é um campo obrigatório" }),
  password: z.string().min(1, { error: "Senha é um campo obrigatório" }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
