class WebSocketManager {
  private static instance: WebSocketManager;
  private sockets: Record<string, WebSocket> = {};

  static getInstance() {
    if (!this.instance) {
      this.instance = new WebSocketManager();
    }
    return this.instance;
  }

  connect(name: string, url: string) {
    if (!this.sockets[name]) {
      this.sockets[name] = new WebSocket(url);
    }
    return this.sockets[name];
  }

  get(name: string) {
    return this.sockets[name];
  }
}

export const ws = WebSocketManager.getInstance();
