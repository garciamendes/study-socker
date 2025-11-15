/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { TaskEvents } from "../events/taskEvents";

let channelInstance: ReturnType<typeof createChannel> | null = null;

function createChannel() {
  let socket: WebSocket | null = null;
  let isClosedByUser = false;

  // Retry
  let reconnectAttempts = 0;
  const MAX_RECONNECT_DELAY = 15000; // 15s

  // Ping-pong (heartbeat)
  let heartbeatInterval: number | null = null;
  let heartbeatTimeout: number | null = null;
  const HEARTBEAT_INTERVAL = 10000; // envia ping a cada 10s
  const HEARTBEAT_TIMEOUT = 5000;   // se não responder → reconectar

  // Background awareness
  let isDocumentHidden = false;

  const messageQueue: string[] = []; // opcional: buffer offline

  const listeners: Record<string, Function[]> = {
    [TaskEvents.CREATED]: [],
    [TaskEvents.UPDATED]: [],
  };

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatInterval = window.setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
        resetHeartbeatTimeout();
      }
    }, HEARTBEAT_INTERVAL);
  }

  function resetHeartbeatTimeout() {
    if (heartbeatTimeout) clearTimeout(heartbeatTimeout);

    heartbeatTimeout = window.setTimeout(() => {
      console.warn("WS heartbeat perdido. Reconectando...");
      socket?.close();
    }, HEARTBEAT_TIMEOUT);
  }

  function stopHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
  }

  function connect() {
    socket = new WebSocket(`${import.meta.env.VITE_API_URL_WS}/tasks/`);

    socket.onopen = () => {
      console.log("WS conectado");
      reconnectAttempts = 0;
      flushMessageQueue();
      startHeartbeat();
    };

    socket.onclose = () => {
      stopHeartbeat();

      if (!isClosedByUser && !isDocumentHidden) {
        scheduleReconnect();
      }
    };

    socket.onerror = () => {
      socket?.close();
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Resposta do ping
      if (data.type === "pong") {
        resetHeartbeatTimeout();
        return;
      }

      listeners[data.event]?.forEach((cb) => cb(data.task));
    };
  }

  function scheduleReconnect() {
    reconnectAttempts++;
    const delay = Math.min(
      Math.pow(2, reconnectAttempts) * 1000,
      MAX_RECONNECT_DELAY
    );

    console.log(`WS desconectado. Tentando reconectar em ${delay}ms...`);

    setTimeout(() => {
      if (!isClosedByUser && !isDocumentHidden) {
        connect();
      }
    }, delay);
  }

  function flushMessageQueue() {
    while (messageQueue.length > 0 && socket?.readyState === WebSocket.OPEN) {
      socket.send(messageQueue.shift()!);
    }
  }

  // Background / aba invisível
  document.addEventListener("visibilitychange", () => {
    isDocumentHidden = document.hidden;

    if (!document.hidden && socket?.readyState !== WebSocket.OPEN) {
      console.log("Aba ativa novamente → reconectando WS");
      connect();
    }

    if (document.hidden) {
      stopHeartbeat();
    }
  });

  // Inicia
  connect();

  return {
    on(event: TaskEvents, callback: Function) {
      listeners[event].push(callback);
    },

    off(event: TaskEvents, callback: Function) {
      listeners[event] = listeners[event].filter((fn) => fn !== callback);
    },

    send(data: unknown) {
      const json = JSON.stringify(data);

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(json);
      } else {
        messageQueue.push(json); // buffer offline
      }
    },

    close() {
      isClosedByUser = true;
      stopHeartbeat();
      socket?.close();
    },

    getSocket() {
      return socket;
    },
  };
}

export function connectTaskChannel() {
  if (!channelInstance) channelInstance = createChannel();
  return channelInstance;
}
