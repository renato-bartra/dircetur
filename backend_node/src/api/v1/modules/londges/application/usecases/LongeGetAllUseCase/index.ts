import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class LondgeGetAllUseCase {
  constructor(private readonly londgeRepo: LondgeRepository) {}

  get = async (): Promise<LondgeListener[]> => {
    const data: LondgeListener[] = await this.londgeRepo.getAll();
    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError())
    return data;
  };
}