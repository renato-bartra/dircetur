import { z, ZodError } from "zod";
import { EmailValidatorManager } from "../../../domain/repositories/EmailValidatorManager";
import { IErrorObject } from "../../../domain/repositories/IErrorObject";

export class EmailValidator implements EmailValidatorManager {
  private watcher: boolean = false;
  private errors: IErrorObject[] = [];
  
  validate = async (email: string): Promise<string | null> => {
    const emailSchema = z
      .string()
      .email({
        message:
          "Por favor, el email debe tener el formato correcto, ejmp: ejemplo@ejemplo.com",
      });
    try {
      emailSchema.parse(email);
      return email;
    } catch (error) {
      this.watcher = true;
      if (error instanceof ZodError) {
        const errors = error.formErrors;
        Object.entries(errors.fieldErrors).forEach(([key, value], i) => {
          if (this.errors[i] === undefined)
            this.errors[i] = { attribute: "", message: "" };
          this.errors[i].attribute = key.toString();
          this.errors[i].message = value.toString();
        });
      }
      return null;
    }
  };

  error = (): boolean | undefined => {
    return this.watcher
  };

  getErrors = (): IErrorObject[] => {
    return this.errors
  };
}
