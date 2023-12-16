import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

//@ts-expect-error: example from docs
export const socket = io(URL);
