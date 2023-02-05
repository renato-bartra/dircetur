import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { Country } from "../../domain/entities/County";
import { CountryRepository } from "../../domain/Repositories/CountryRepository";
import { MySQLCountryRepository } from "../../infraestructure/implementations/MySQL/MySQLCountryRepository";
import { GetAllCountriesUseCase } from "../usecases/GetAllCountriesUseCase";
import { GetByIdCountryUseCase } from "../usecases/GetByIdCountryUsecase";

export class CountryController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly countryRepository: CountryRepository = new MySQLCountryRepository();
  /* -------------------------------------------------------------------------- */
  /*                                  Get by ID                                 */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<IResponseObject> => {
    const getAllUseCase: GetAllCountriesUseCase = new GetAllCountriesUseCase(
      this.countryRepository
    );
    try {
      const response: Country[] = await getAllUseCase.get();
      let cities: object[] = [];
      Object.entries(response).forEach(([key, value], i) => {
        let clase: object = {
          id: value.id,
          description: value.description,
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
  /*                                  Get by ID                                 */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getByIdUseCase: GetByIdCountryUseCase = new GetByIdCountryUseCase(
      this.countryRepository
    );
    try {
      const country: Country = await getByIdUseCase.get(id);
      this.data = {
        code: 200,
        message: '',
        body:{
          id: country.id,
          description: country.description
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