import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class LondgeGetByIdUseCase {
  constructor( private readonly londgeRepo: LondgeRepository){}

  // consigue un usuario
  get = async(id: number): Promise<LondgeListener> => {
    const data: LondgeListener|null = await this.londgeRepo.getById(id);
    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError());
    if (data === null) throw new EntityNotFoundException();
    return data;
  }
}