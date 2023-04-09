import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { TokenException } from "../../../../shared/domain/exeptions/TokenException";
import { ITokenObject } from "../../../../shared/domain/repositories/ITokenObject";
import { PasswordManager } from "../../../../shared/domain/repositories/PasswordManager";
import { TokenManager } from "../../../../shared/domain/repositories/TokenManager";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { LondgeLogin } from "../../../domain/entities/LondgeLogin";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class LondgeLoginUseCase {
  constructor(
    private readonly londgeRepo: LondgeRepository,
    private readonly passwordManager: PasswordManager,
    private readonly tokenManager: TokenManager
  ) {}

 login = async (email:string, password: string): Promise<[string, LondgeListener]> => {
    // Consigue el usuario de la DB
    const londge: LondgeLogin | null = await this.londgeRepo.getByEmail(email);
    if (this.londgeRepo.error())
      throw new DataBaseException(this.londgeRepo.getError());
    if (londge === null)
      throw new EntityNotFoundException();
    // Decript password
    const passDecript: boolean = await this.passwordManager.decrypt(
      password,
      londge.password
    );
    if (!passDecript) throw new EntityNotFoundException();
    // Create token
    const tokenObject: ITokenObject = {
      sub: londge.id,
      son: londge.trade_name,
      ema: londge.email,
      tou: ['londge']
    }
    const token: string = await this.tokenManager.make(tokenObject);
    if (this.tokenManager.error())
      throw new TokenException(this.tokenManager.getError());
    // remove password in response
    const {password: _, ...londgeListener} = londge;
    // end
    const resLondge: LondgeListener = londgeListener;
    return [token, resLondge];
 }
}
