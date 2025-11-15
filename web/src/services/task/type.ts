import type { Pagination } from "@/utils/types";
import z from "zod";

export const TaskCreateSchema = z.object({
  title: z.string().min(1, { error: "Precisa ter algo para criar uma task" }),
});
export type TaskCreateSchemaType = z.infer<typeof TaskCreateSchema>;

export interface ITask {
  uuid: string;
  title: string;
  finish_at: string;
  amount_likes: number;
  has_my_like: boolean;
  created_at: string;
  user: {
    uuid: string;
    first_name: string;
    username: string;
  };
}

export type TaskList = Pagination<ITask>;
