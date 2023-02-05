export class LondgeAlreadyExistException extends Error {
  constructor(){
    super('Error: El email del hospedaje ya se encuentra registrado, por favor virificar si el hospedaje ya existe')
  }
}