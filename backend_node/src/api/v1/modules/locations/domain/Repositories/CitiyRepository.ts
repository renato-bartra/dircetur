import { City } from "../entities/City";

export interface CityRepository {
  getAll: () => Promise<City[]>;
  getById: (id: number) => Promise<City|null>;
  error: () => boolean;
  getErrors: () => string;
}