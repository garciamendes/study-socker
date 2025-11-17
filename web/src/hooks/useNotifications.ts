import { useContext } from "react";
import { NotificationContext } from "@/context/notificationContext";

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationContext must be used inside <NotificationProvider>"
    );
  return ctx;
}
