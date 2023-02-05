import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class LondgeDeleteUseCase {
  constructor(private readonly londgeRepo: LondgeRepository) {}

  delete = async (id: number): Promise<boolean> => {
    const deleter = await this.londgeRepo.delete(id);
    if ( this.londgeRepo.error()) 
      throw new DataBaseException(this.londgeRepo.getError());
    if (!deleter) throw new EntityNotFoundException();
    return deleter;
  }
}