import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { LondgeRepository } from "../../repositories/LondgeRepository";

export class ExistLondgeValidator {
  constructor(private readonly londgeRepo: LondgeRepository) {}

  get = async (email: string): Promise<boolean> => {
    const user = await this.londgeRepo.getByEmail(email);
    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError())
    if (user === null) return false;
    return true;
  };
}
