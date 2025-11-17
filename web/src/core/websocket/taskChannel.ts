/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { ws } from ".";
import { TaskEvents } from "../events/taskEvents";

export function connectTaskChannel() {
  const socket = ws.connect(
    "tasks",
    `${import.meta.env.VITE_API_URL_WS}/tasks/?token=${localStorage.getItem('token')}`
  );

  const listeners: Record<string, Function[]> = {
    [TaskEvents.CREATED]: [],
    [TaskEvents.UPDATED]: [],
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    listeners[message.event]?.forEach((cb) => cb(message));
  };

  return {
    on(event: TaskEvents, callback: Function) {
      listeners[event].push(callback);
    },
  };
}
