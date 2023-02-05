import { GetByIdCityUseCase } from "../../../application/usecases/GetByIdCityUseCase";
import { City } from "../../../domain/entities/City";
import { CityRepository } from "../../../domain/Repositories/CitiyRepository";
import { MySQLCityRepository } from "../../implementations/MySQL/MySQLCityRepository";

const consoleTest = async () =>{
  const cityRepo: CityRepository = new MySQLCityRepository();
  const getAllUseCase: GetByIdCityUseCase = new GetByIdCityUseCase(cityRepo);
  const clases: City = await getAllUseCase.get(30);
  console.log(clases);
}

consoleTest();