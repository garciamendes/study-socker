import { createContext, useEffect, useState, type ReactNode } from "react";
import { connectNotificationChannel } from "@/core/websocket/notificationChannel";
import { NotificationEvents } from "@/core/events/notificationEvents";

interface INotification {
  uuid: string;
  title: string;
  message: string;
  data: {
    task?: string;
    task_like?: string;
    liked_by?: string;
  };
  created_at: string;
  is_read: boolean;
}

interface NotificationContextState {
  notifications: INotification[];
  count: number;
  lastNotification: INotification | null;

  onTaskLike: (cb: (taskUuid: string, likedBy: string) => void) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContextState | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [count, setCount] = useState(0);
  const [lastNotification, setLastNotification] = useState<INotification | null>(null);

  const taskLikeListeners: Array<(taskUuid: string, likedBy: string) => void> = [];

  const onTaskLike = (cb: (taskUuid: string, likedBy: string) => void) => {
    taskLikeListeners.push(cb);
  };

  useEffect(() => {
    const channel = connectNotificationChannel();

    channel.on(NotificationEvents.TASK_LIKED, ({ notification }: { notification: INotification }) => {
      // adiciona ao estado
      setNotifications(prev => [notification, ...prev]);

      // incrementa contagem
      new Audio('/notification.mp3').play()
      setCount(prev => prev + 1);

      // última notificação usada para toasts/alerts
      setLastNotification(notification);

      // dispara listeners internos (task realtime)
      const task = notification.data.task;
      const likedBy = notification.data.liked_by;

      if (task) {
        taskLikeListeners.forEach(cb => cb(task, likedBy ?? ""));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      count,
      lastNotification,
      onTaskLike,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
