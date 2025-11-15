import { api } from "@/lib/api";
import type { ITask, TaskCreateSchemaType, TaskList } from "./type";

export class TaskService {
  list({ pageParam }: { pageParam: number }) {
    return api.get<TaskList>(`/api/tasks/?page=${pageParam}`);
  }

  create(data: TaskCreateSchemaType) {
    return api.post<ITask>("/api/tasks/", data);
  }

  like(uuid: string) {
    return api.post<void>(`/api/tasks/${uuid}/like/`);
  }

  deslike(uuid: string) {
    return api.delete<void>(`/api/tasks/${uuid}/deslike/`);
  }
}

export const taskService = new TaskService();
