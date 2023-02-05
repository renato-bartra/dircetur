import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { Clase } from "../../../domain/entities/Clase";
import { ClaseRepository } from "../../../domain/repositories/ClaseRepository";

export class GetByIdUseCase {
  constructor(private readonly claseRepository: ClaseRepository) {}

  get = async (id: number): Promise<Clase> => {
    const clase: Clase | null = await this.claseRepository.getById(id);
    if (clase === null) throw new EntityNotFoundException();
    if (this.claseRepository.error())
      throw new DataBaseException(this.claseRepository.getError());
    return clase;
  };
}
