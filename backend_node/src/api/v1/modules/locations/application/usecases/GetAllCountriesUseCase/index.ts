import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { Country } from "../../../domain/entities/County";
import { CountryRepository } from "../../../domain/Repositories/CountryRepository";

export class GetAllCountriesUseCase {
  constructor(private readonly countryRepository: CountryRepository) {}

  get = async (): Promise<Country[]> => {
    const countries: Country[] = await this.countryRepository.getAll();
    if (this.countryRepository.error())
      throw new DataBaseException(this.countryRepository.getErrors());
    return countries;
  };
}