import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { City } from "../../../domain/entities/City";
import { CityRepository } from "../../../domain/Repositories/CitiyRepository";

export class GetByIdCityUseCase {
  constructor(private readonly cityRepository: CityRepository) {}

  get = async (id: number): Promise<City> => {
    const city: City | null = await this.cityRepository.getById(id);
    if (this.cityRepository.error())
      throw new DataBaseException(this.cityRepository.getErrors());
    if (city === null) throw new EntityNotFoundException();
    return city;
  };
}
