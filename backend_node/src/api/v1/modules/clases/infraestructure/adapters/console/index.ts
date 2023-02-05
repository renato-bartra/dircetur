import { GetAllUseCase } from "../../../application/useCases/GetAllUseCase"
import { GetByIdUseCase } from "../../../application/useCases/GetByIdUseCase";
import { Clase } from "../../../domain/entities/Clase";
import { ClaseRepository } from "../../../domain/repositories/ClaseRepository"
import { MySQLClaseRepositori } from "../../implementations/MySQL/MySQLClaseRepository"

const consoleTest = async () =>{
  const claseRepo: ClaseRepository = new MySQLClaseRepositori();
  const getAllUseCase: GetByIdUseCase = new GetByIdUseCase(claseRepo);
  const clases: Clase = await getAllUseCase.get(2);
  console.log(clases);
}

consoleTest();