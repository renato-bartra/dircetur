export class ExistsFormException extends Error {
  constructor(tradeName: string, month: string){
    super (`Error: El hospedaje ${tradeName} ya envió el formulario del mes de ${month}`)
  }
}