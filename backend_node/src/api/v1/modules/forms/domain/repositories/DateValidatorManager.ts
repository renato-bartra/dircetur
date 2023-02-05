import { IErrorObject } from "../../../shared/domain/repositories/IErrorObject";

export interface DateValidatorManager {
  validate: (date: object) => Promise<boolean>;
  error: () => boolean;
  getError: () => IErrorObject[];
}