export class PDFException extends Error {
  constructor(error: string){
    super (`Error: ${error}`)
  }
}