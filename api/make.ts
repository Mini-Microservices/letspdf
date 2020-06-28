import { NowRequest, NowResponse } from '@vercel/node'
import PdfPrinter from "pdfmake"
import pdfMake from "pdfmake/build/pdfmake"
import fonts from "../lib/fonts"
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import {Base64Encode} from 'base64-stream';

export default function(req: NowRequest, res: NowResponse) {
  const printer = new PdfPrinter(fonts)
  const docDefinition: TDocumentDefinitions = {
    content: [
      'First paragraph',
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]
  }

  const doc: PDFKit.PDFDocument = printer.createPdfKitDocument(docDefinition)

  let finalString = ""
  var stream = doc.pipe(new Base64Encode())

  doc.end(); // will trigger the stream to end

  stream.on('data', function(chunk) {
      finalString += chunk;
  });

  stream.on('end', function() {
      // the stream is at its end, so push the resulting base64 string to the response
      res.json(finalString);
  });

  // res.send(finalString)
}
