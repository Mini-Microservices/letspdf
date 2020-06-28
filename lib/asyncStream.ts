import { Readable } from "stream";

/**
 * Wraps a stream readable to be used as a promise
 *
 * @export
 * @param {Readable} readable
 * @returns {(Promise<string|Error>)}
 */
export default async function(readable: Readable): Promise<string|Error> {
  return new Promise((resolve, reject) => {
    let data: string = ""
    readable.on("data", (chunk) => data += chunk)
    readable.on("end", () => resolve(data))
    readable.on("error", (err) => reject(err))
  })
}
