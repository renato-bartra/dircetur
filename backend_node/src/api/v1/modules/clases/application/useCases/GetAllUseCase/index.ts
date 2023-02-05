import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { Clase } from "../../../domain/entities/Clase";
import { ClaseRepository } from "../../../domain/repositories/ClaseRepository";

export class GetAllUseCase {
  constructor(private readonly claseRepository: ClaseRepository) {}

  get = async (): Promise<Clase[]> => {
    const clases: Clase[] = await this.claseRepository.getAll();
    if (this.claseRepository.error())
      throw new DataBaseException(this.claseRepository.getError());
    return clases;
  };
}
