# PDF Generator Microservices

A service to generate very basic pdfs using the [pdfmake](https://github.com/bpampuch/pdfmake) library. Generating pdfs on the client can be expensive, so pawn off the process to a server.

## Usage

```js
const headers = new Headers();
headers.append("Content-Type", "application/json");

const docDefinition = {...}
const options = {...}

const json = JSON.stringify({
  document: docDefinition,
  options,
});

const res = await fetch("https://letspdf.vercel.app/api/make", {
  method: 'POST',
  headers: headers,
  body: json
})
const json = await res.json()
```

### JSON structure

If you're using Typescript you're able to install the type definitions to ensure the data you pass is correct.

```
yarn add @types/pdfmake
```

- docDefinition: [TDocumentDefinitions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/4e2b7278ed5d4f1147775c9e5e35cdea0b489165/types/pdfmake/interfaces.d.ts#L391)
- options: [BufferOptions](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/4e2b7278ed5d4f1147775c9e5e35cdea0b489165/types/pdfmake/interfaces.d.ts#L453) (optional)

If the response was successful, the `message` property will contain a base 64 string, from there you need to use a package like [b64-to-blob](https://www.npmjs.com/package/b64-to-blob) to convert the string to a blob.
