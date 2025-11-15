import { useEffect } from "react";
import { connectNotificationChannel } from "@/core/websocket/notificationChannel";
import { NotificationEvents } from "@/core/events/notificationEvents";

export function useNotifications() {
  // const add = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    const channel = connectNotificationChannel();

    channel.on(NotificationEvents.NEW, (notif) => {
      console.log(notif);
      // add({
      //   id: crypto.randomUUID(),
      //   message: notif.message,
      //   taskId: notif.task_id,
      //   createdAt: new Date(),
      // });
    });
  }, []);
}
