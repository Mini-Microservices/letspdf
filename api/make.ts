import { NowRequest, NowResponse } from '@vercel/node'
import PdfPrinter from "pdfmake"
import fonts from "../lib/fonts"
import { TDocumentDefinitions, BufferOptions } from 'pdfmake/interfaces'
import {Base64Encode} from 'base64-stream'
import asyncStream from '../lib/asyncStream'
import response from '../lib/response'
import errorHandling from '../lib/errors'

/**
 * Endpoint to generate the pdf document
 *
 * On success it will return a base64 encoded string
 *
 * @export
 * @param {NowRequest} req
 * @param {NowResponse} res
 */
export default async function(req: NowRequest, res: NowResponse) {
  try {
    /**
     * @see https://vercel.com/docs/runtimes#official-runtimes/node-js/node-js-request-and-response-objects/request-body
     */
    req.body

    if (!errorHandling(req, res)) return

    const printer = new PdfPrinter(fonts)
    const docDefinition: TDocumentDefinitions = {
      content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
      ]
    }
    const options: BufferOptions = {}

    const doc: PDFKit.PDFDocument = printer.createPdfKitDocument(docDefinition, options)
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
