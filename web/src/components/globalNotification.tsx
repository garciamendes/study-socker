import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect } from "react";

export function GlobalNotificationToaster() {
  const { lastNotification } = useNotifications();
  console.log('LAST', lastNotification)

  useEffect(() => {
    if (!lastNotification) return;

    toast.info(lastNotification.title, {
      description: lastNotification.message,
    });
  }, [lastNotification]);

  return null;
}
