import { NowRequest, NowResponse } from '@vercel/node'
import PdfPrinter from "pdfmake"
import fonts from "../lib/fonts"
import {Base64Encode} from 'base64-stream'
import asyncStream from '../lib/asyncStream'
import response from '../lib/response'
import errorHandling from '../lib/errors'
import getOptions from '../lib/getOptions'
import allowCors from '../lib/allowCors'

/**
 * Endpoint to generate the pdf document
 *
 * On success it will return a base64 encoded string
 *
 * @export
 * @param {NowRequest} req
 * @param {NowResponse} res
 */
const handler = async (req: NowRequest, res: NowResponse) => {
  try {
    /**
     * @see https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/request-body
     */
    req.body

    if (!errorHandling(req, res)) return

    const printer = new PdfPrinter(fonts)
    const {
      document: docDefinition,
      options
    } = req.body

    const doc: PDFKit.PDFDocument = printer.createPdfKitDocument(docDefinition, getOptions(options))
    var stream = doc.pipe(new Base64Encode())

    // will trigger the stream to end
    doc.end()

    try {
      const data = await asyncStream(stream)
      if (data instanceof Error) throw new Error(data.message)

      response(res, data, 200)
    } catch (err) {
      response(res, err.message, 500)
    }
  }
  catch (err) {
    response(res, err.message, 400)
  }
}

module.exports = allowCors(handler)
