import { NowResponse, NowRequest, NowRequestBody } from "@vercel/node";
import response from "./response";
import isObject from "lodash.isobject"

enum ErrorMsg {
  InvalidMethod = "Invalid method, route only accepts 'POST'",
  InvalidContentType = "Invalid Content-Type",
  InvalidRequestBody = "Request 'body' is invalid, it requires a object, 'document' with a property 'content[]'",
  InvalidOptions = "Request 'options' is invalid, if 'options' are provided if should be an object"
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

export const invalidRequestBody = (res: NowResponse): void => {
  return response(res, ErrorMsg.InvalidRequestBody, 400)
}

export const invalidRequestOptions = (res: NowResponse): void => {
  return response(res, ErrorMsg.InvalidOptions, 400)
}

const hasInvalidBody = (body: NowRequestBody): boolean => {
  if (!body || !body.document || !body.document.content) {
    return true
  }

  if (!Array.isArray(body.document.content)) {
    return true
  }

  return false
}

const hasInvalidOptions = (body: NowRequestBody): boolean => {
  if (typeof body?.options !== "undefined") {
    if (!isObject(body.options)) {
      return true
    }
  }

  return false
}

export default function errorHandling(req: NowRequest, res: NowResponse): void | true {
  const checks: IErrorChecks[] = [
    {
      check: req?.method !== "POST",
      method: invalidMethod
    },
    {
      check: req.headers?.["content-type"] !== "application/json",
      method: invalidContentType
    },
    {
      check: hasInvalidBody(req.body),
      method: invalidRequestBody
    },
    {
      check: hasInvalidOptions(req.body),
      method: invalidRequestOptions
    }
  ]

  for (let i = 0; i < checks.length; i++) {
    if (checks[i].check) {
      checks[i].method(res)
      return
    }
  }

  return true
}
