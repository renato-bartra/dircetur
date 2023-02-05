import { ExistEmailValidator } from "../../../../shared/domain/services/ExistsEmailValidator";
import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { DataValidationException } from "../../../../shared/domain/exeptions/DataValidationException";
import { PasswordManager } from "../../../../shared/domain/repositories/PasswordManager";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";
import { Londge } from "../../../domain/entities/Londge";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { LondgeAlreadyExistException } from "../../../domain/exceptions/LondgeAlreadyExistException";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";
import { SharedRepository } from "../../../../shared/domain/repositories/SharedRepository";

export class LondgeCreatorUseCase {
  private readonly existsLonge: ExistEmailValidator;
  constructor(
    private readonly londgeRepo: LondgeRepository,
    private readonly sharedRepo: SharedRepository,
    private readonly passwordManager: PasswordManager,
    private readonly validatorManager: ValidatorManager
  ) {
    this.existsLonge = new ExistEmailValidator(this.sharedRepo);
  }

  create = async (londge: Londge): Promise<LondgeListener> => {
    // Valida los datos
    await this.validatorManager.validate(londge);
    if(this.validatorManager.error())
      throw new DataValidationException(this.validatorManager.getErrors());
    // Valida si el email ya existe
    const emailExists: boolean = await this.existsLonge.get(londge.email);
    if (emailExists) throw new LondgeAlreadyExistException();
    // encripta la contraseña
    londge.password = await this.passwordManager.encrypt(londge.password);
    // persiste la hospedaje
    const londgeCreate: LondgeListener = await this.londgeRepo.create(londge);
    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError());
    return londgeCreate;
  }
}
