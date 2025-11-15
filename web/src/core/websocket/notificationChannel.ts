/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/core/websocket/notificationChannel.ts
import { NotificationEvents } from "../events/notificationEvents";
import { ws } from "./index";

export function connectNotificationChannel() {
  const socket = ws.connect(
    "notifications",
    `${import.meta.env.VITE_API_URL_WS}/notifications/`
  );

  const listeners: Record<string, Function[]> = {
    [NotificationEvents.NEW]: [],
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    listeners[message.event]?.forEach((cb) => cb(message));
  };

  return {
    on(event: NotificationEvents, callback: Function) {
      listeners[event].push(callback);
    },
  };
}
