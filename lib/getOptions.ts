import { BufferOptions } from "pdfmake/interfaces";
import pick from "lodash.pick"

export default (options: any): BufferOptions => {
  const validOptions: BufferOptions = pick(options || {}, [
    "fontLayoutCache",
    "bufferPages",
    "tableLayouts",
    "autoPrint",
    "progressCallback",
  ])

  return validOptions
}
