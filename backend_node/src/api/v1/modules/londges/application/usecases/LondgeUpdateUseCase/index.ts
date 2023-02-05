import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { DataValidationException } from "../../../../shared/domain/exeptions/DataValidationException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";
import { Londge } from "../../../domain/entities/Londge";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class LondgeUpdateUseCase {
  constructor(
    private readonly londgeRepo: LondgeRepository,
    private readonly validatorManager: ValidatorManager
  ) {}

  update = async (id: number, longe: Londge): Promise<boolean> => {
    // Primero Valida los datos
    await this.validatorManager.validate(longe);

    if (this.validatorManager.error())
      throw new DataValidationException(this.validatorManager.getErrors());

    const data: boolean = await this.londgeRepo.update(id, longe);

    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError());

    if (!data) throw new EntityNotFoundException();

    return data;
  };
}
