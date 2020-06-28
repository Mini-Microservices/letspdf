import { NowResponse, NowRequest } from "@vercel/node";
import response from "./response";

enum ErrorMsg {
  InvalidMethod = "Invalid method, route only accepts 'POST'",
  InvalidContentType = "Invalid Content-Type"
}

type ErrorMethodSignature = (res: NowResponse) => void

interface IErrorChecks {
  check: boolean,
  method: ErrorMethodSignature
}

export const invalidMethod = (res: NowResponse) => {
  return response(res, ErrorMsg.InvalidMethod, 400)
}

export const invalidContentType = (res: NowResponse): void => {
  return response(res, ErrorMsg.InvalidContentType, 400)
}

export default function errorHandling(req: NowRequest, res: NowResponse): void | true {
  const checks: IErrorChecks[] = [
    {check: req?.method !== "POST", method: invalidMethod},
    {check: req.headers?.["content-type"] !== "application/json", method: invalidContentType}
  ]

  for (let i = 0; i < checks.length; i++) {
    if (checks[i].check) {
      checks[i].method(res)
      return
    }
  }

  return true
}
