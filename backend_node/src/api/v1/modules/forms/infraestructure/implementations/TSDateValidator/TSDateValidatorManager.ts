import { IErrorObject } from "src/api/v1/modules/shared/domain/repositories/IErrorObject";
import { DateValidatorManager } from "../../../domain/repositories/DateValidatorManager";

export class TSDatevalidatorManager implements DateValidatorManager {
  private errorListener: boolean = false;
  private errors: IErrorObject[] = [];

  validate = async (dates: object): Promise<boolean> => {
    const regex: RegExp = /^\d{4}-\d{2}-\d{2}$/;

    Object.entries(dates).forEach(([key, value], i) => {
      if (value.match(regex) === null) {
        this.errors[i].attribute = key.toString();
        this.errors[i].message = 'Por favor la fecha debe tener el formato YYYY-mm-dd';
        this.errorListener = true;
        return false;
      }
      const dateFunc = new Date(value);

      const timestamp = dateFunc.getTime();

      if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
        this.errors[i].attribute = key.toString();
        this.errors[i].message = 'Por favor validar que el día se encuentre dentro del rango de días del mes enviado'
        this.errorListener = true;
        return false;
      }
    })
    this.errorListener = false;
    return true;
  }

  error = (): boolean => this.errorListener;
  getError = (): IErrorObject[] => this.errors;
}
