import { taskService } from "@/services/task";
import type { TaskCreateSchemaType } from "@/services/task/type";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useTask = () => {
  return {
    list: useInfiniteQuery({
      queryKey: ["tasks"],
      queryFn: taskService.list,
      initialPageParam: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getPreviousPageParam: (firstPage: any) => firstPage.prevCursor,
    }),

    create: useMutation({
      mutationFn: (data: TaskCreateSchemaType) => taskService.create(data),
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }),

    like: useMutation({
      mutationFn: (uuid: string) => taskService.like(uuid)
    }),

    deslike: useMutation({
      mutationFn: (uuid: string) => taskService.deslike(uuid)
    })
  };
};
