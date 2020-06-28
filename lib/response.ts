import { NowResponse } from "@vercel/node";

export default function response(res: NowResponse, message: string, status: number, extra?: {}): void {
  res.status(status).json({
    message,
    ...extra
  })
}
