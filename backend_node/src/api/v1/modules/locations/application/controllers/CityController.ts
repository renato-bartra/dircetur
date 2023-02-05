import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { City } from "../../domain/entities/City";
import { CityRepository } from "../../domain/Repositories/CitiyRepository";
import { MySQLCityRepository } from "../../infraestructure/implementations/MySQL/MySQLCityRepository";
import { GetAllCitiesUseCase } from "../usecases/GetAllCitiesUsecase";
import { GetByIdCityUseCase } from "../usecases/GetByIdCityUseCase";

export class CityController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly cityRepository: CityRepository = new MySQLCityRepository();

  /* -------------------------------------------------------------------------- */
  /*                               Get All cities                               */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<IResponseObject> => {
    const getAllUseCase: GetAllCitiesUseCase = new GetAllCitiesUseCase(
      this.cityRepository
    );
    try {
      const response: City[] = await getAllUseCase.get();
      let cities: object[] = [];
      Object.entries(response).forEach(([key, value], i) => {
        let clase: object = {
          id: value.id,
          city: value.city,
        };
        cities[i] = clase;
      });
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: cities,
      };
    } catch (error) {
      this.data = {
        code: 500,
        message: `Server error: ${error}`,
        body: [],
      };
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                Get one city                                */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getByIdUseCase: GetByIdCityUseCase = new GetByIdCityUseCase(
      this.cityRepository
    );
    try {
      const city: City = await getByIdUseCase.get(id);
      this.data = {
        code: 200,
        message: '',
        body:{
          id: city.id,
          city: city.city
        }
      }
    } catch (error) {
      if (error instanceof EntityNotFoundException){
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  };
}
