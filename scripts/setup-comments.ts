import { readFileSync } from "fs";
import { join } from "path";
import * as net from "net";
import { Client } from "pg";

const sql = readFileSync(join(__dirname, "setup-comments.sql"), "utf-8");

function tunnel(
  proxyHost: string,
  proxyPort: number,
  targetHost: string,
  targetPort: number
): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: proxyHost, port: proxyPort });

    let data = "";
    socket.on("data", (chunk: Buffer) => {
      data += chunk.toString();
      if (data.includes("\r\n\r\n")) {
        const status = data.split(" ")[1];
        if (status === "200") {
          socket.removeAllListeners("data");
          resolve(socket);
        } else {
          socket.destroy();
          reject(new Error(`代理返回 ${status}: ${data.split("\n")[0]}`));
        }
      }
    });

    socket.on("error", reject);
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("代理连接超时"));
    });
    socket.setTimeout(10000);

    socket.write(
      `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n\r\n`
    );
  });
}

async function main() {
  console.log("正在通过代理 127.0.0.1:7897 连接数据库...");
  try {
    const socket = await tunnel(
      "127.0.0.1",
      7897,
      "db.azywnfehxshmcvkkpuul.supabase.co",
      5432
    );
    console.log("隧道已建立，登录数据库...");

    socket.connect = (port?: unknown, host?: unknown, cb?: () => void) => {
      if (typeof port === "function") cb = port as () => void;
      if (typeof host === "function") cb = host as () => void;
      process.nextTick(() => socket.emit("connect"));
      if (cb) process.nextTick(cb);
    };

    const client = new Client({
      user: "postgres",
      password: "phner314159..",
      database: "postgres",
      stream: socket,
    });

    await client.connect();
    console.log("已连接，正在创建 comments 表...");
    await client.query(sql);
    await client.end();
    console.log("✓ comments 表已创建，RLS 策略已配置。");
  } catch (err) {
    console.error("执行失败:", err);
    process.exit(1);
  }
}

main();
