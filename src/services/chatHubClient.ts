import {
  getApiBaseUrl,
  getStoredAccessToken,
  type MessageRead,
} from "./hiredInApi";

const RECORD_SEPARATOR = "\x1e";

type PendingInvocation = {
  resolve: (value: MessageRead) => void;
  reject: (reason?: unknown) => void;
  timeoutId: number;
};

export async function sendChatMessage(chatId: string, content: string) {
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("Щоб надсилати повідомлення, потрібно увійти в акаунт.");
  }

  return new Promise<MessageRead>((resolve, reject) => {
    const socket = new WebSocket(buildHubUrl(token));
    const pending = new Map<string, PendingInvocation>();
    let invocationId = 0;
    let isHandshakeDone = false;
    let buffer = "";

    const fail = (reason: unknown) => {
      pending.forEach((item) => {
        window.clearTimeout(item.timeoutId);
        item.reject(reason);
      });
      pending.clear();
      reject(reason);
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };

    const invoke = (
      target: "JoinChat" | "SendMessage",
      args: unknown[],
      onResult?: (result: MessageRead) => void,
    ) => {
      const id = String(++invocationId);
      socket.send(
        JSON.stringify({
          type: 1,
          invocationId: id,
          target,
          arguments: args,
        }) + RECORD_SEPARATOR,
      );

      if (onResult) {
        const timeoutId = window.setTimeout(() => {
          pending.delete(id);
          fail(new Error("Сервер не відповів на повідомлення."));
        }, 15000);

        pending.set(id, {
          resolve: onResult,
          reject,
          timeoutId,
        });
      }
    };

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ protocol: "json", version: 1 }) + RECORD_SEPARATOR);
    });

    socket.addEventListener("message", (event) => {
      buffer += String(event.data);
      const frames = buffer.split(RECORD_SEPARATOR);
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        if (!frame) continue;

        let payload: {
          type?: number;
          invocationId?: string;
          result?: MessageRead;
          error?: string;
          target?: string;
          arguments?: MessageRead[];
        };

        try {
          payload = JSON.parse(frame);
        } catch {
          continue;
        }

        if (!isHandshakeDone && payload.type == null) {
          isHandshakeDone = true;
          invoke("JoinChat", [chatId]);
          invoke("SendMessage", [chatId, content], (message) => {
            resolve(message);
            socket.close();
          });
          continue;
        }

        if (payload.type === 3 && payload.invocationId) {
          const item = pending.get(payload.invocationId);
          if (!item) continue;

          window.clearTimeout(item.timeoutId);
          pending.delete(payload.invocationId);

          if (payload.error) {
            item.reject(new Error(payload.error));
          } else if (payload.result) {
            item.resolve(payload.result);
          }
        }

        if (payload.type === 1 && payload.target === "ReceiveMessage") {
          const message = payload.arguments?.[0];
          if (message) {
            resolve(message);
            socket.close();
          }
        }
      }
    });

    socket.addEventListener("error", () => {
      fail(new Error("Не вдалося підключитися до чату."));
    });

    socket.addEventListener("close", (event) => {
      if (!isHandshakeDone && event.code !== 1000) {
        fail(new Error("З'єднання з чатом закрилося до відправки."));
      }
    });
  });
}

function buildHubUrl(token: string) {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = new URL(`${base}/hubs/chat`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set("access_token", token);
  return url.toString();
}
