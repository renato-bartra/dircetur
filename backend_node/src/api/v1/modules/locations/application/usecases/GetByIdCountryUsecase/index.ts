import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { Country } from "../../../domain/entities/County";
import { CountryRepository } from "../../../domain/Repositories/CountryRepository";

export class GetByIdCountryUseCase {
  constructor(private readonly countryRepository: CountryRepository) {}

  get = async (id: number): Promise<Country> => {
    const country: Country | null = await this.countryRepository.getById(id);
    if (this.countryRepository.error())
      throw new DataBaseException(this.countryRepository.getErrors());
    if (country === null) throw new EntityNotFoundException();
    return country;
  };
}
