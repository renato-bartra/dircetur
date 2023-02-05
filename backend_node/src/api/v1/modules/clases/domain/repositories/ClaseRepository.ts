import { Clase } from "../entities/Clase";

export interface ClaseRepository {
  getAll: () => Promise<Clase[]>;
  getById: (id: number) => Promise<Clase|null>;
  error: () => boolean;
  getError: () => string;
}