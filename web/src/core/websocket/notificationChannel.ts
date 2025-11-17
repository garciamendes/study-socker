/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/core/websocket/notificationChannel.ts
import { NotificationEvents } from "../events/notificationEvents";
import { ws } from "./index";

export function connectNotificationChannel() {
  const socket = ws.connect(
    "notifications",
    `${
      import.meta.env.VITE_API_URL_WS
    }/notifications/?token=${localStorage.getItem("token")}`
  );

  const listeners: Record<string, Function[]> = {};

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    listeners[message.event]?.forEach((cb) => cb(message));
  };

  return {
    on(event: NotificationEvents, callback: Function) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },
  };
}
