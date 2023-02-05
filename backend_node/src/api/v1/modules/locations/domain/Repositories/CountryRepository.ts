import { Country } from "../entities/County";

export interface CountryRepository {
  getAll: () => Promise<Country[]>;
  getById: (id: number) => Promise<Country|null>;
  error: () => boolean;
  getErrors: () => string;
}