import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { City } from "../../../domain/entities/City";
import { CityRepository } from "../../../domain/Repositories/CitiyRepository";

export class GetAllCitiesUseCase {
  constructor(private readonly cityRepository: CityRepository) {}

  get = async (): Promise<City[]> => {
    const cities: City[] = await this.cityRepository.getAll();
    if (this.cityRepository.error())
      throw new DataBaseException(this.cityRepository.getErrors());
    return cities;
  };
}
