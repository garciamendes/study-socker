/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { queryClient } from "@/App";
import { connectTaskChannel } from "@/core/websocket/taskChannel";
import { TaskEvents } from "@/core/events/taskEvents";
import type { ITask } from "@/services/task/type";

export function useTasksRealtime() {
  useEffect(() => {
    const channel = connectTaskChannel();

    const handleCreated = (data: ITask) => {
      queryClient.setQueryData(["tasks"], (old: any) => {
        if (!old?.pages) {
          return {
            pages: [
              {
                results: [data],
                nextCursor: null,
                prevCursor: null,
              },
            ],
            pageParams: [1],
          };
        }

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              results: [data, ...old.pages[0].results],
            },
            ...old.pages.slice(1),
          ],
        };
      });
    };

    const handleUpdated = ({ task }: { task: ITask }) => {
      queryClient.setQueryData(["tasks"], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results.map((t: ITask) =>
              t.uuid === task.uuid ? task : t
            ),
          })),
        };
      });
    };

    // registrar listeners
    channel.on(TaskEvents.CREATED, handleCreated);
    channel.on(TaskEvents.UPDATED, handleUpdated);

    return () => {
      // remover listeners ao desmontar
      channel.off(TaskEvents.CREATED, handleCreated);
      channel.off(TaskEvents.UPDATED, handleUpdated);
    };
  }, []);
}
