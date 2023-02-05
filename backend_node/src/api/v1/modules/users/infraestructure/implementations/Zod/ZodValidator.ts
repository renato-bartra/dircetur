import { z, ZodError } from "zod";
import { User } from "../../../domain/entities/User";
import { IErrorObject } from "../../../../shared/domain/repositories/IErrorObject";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";

export class ZodValidator implements ValidatorManager {
  private errors: IErrorObject[] = [];
  constructor(private watcher?: boolean) {}
  validate = async (user: object): Promise<object | null> => {
    // Inicializa las validaciones regex
    const regex_name: RegExp = new RegExp(/^[a-z áéíóúñäëïöü\s]*$/, 'i');
    const regex_dni: RegExp = new RegExp('^[0-9]*$');
    // inicializa el exquema de zod
    const userSchema: z.ZodSchema<User> = z.object({
      id: z.number(),
      first_name: z.string().regex(regex_name, {message:"El nombre solo debe contener letras"}).max(90),
      last_name: z.string().regex(regex_name, {message:"El apellido solo debe contener letras"}).max(90).nullable(),
      dni: z.string().regex(regex_dni, {message:"El DNI solo debe contener números"}).length(8, {message:"El DNI debe solo debe contener 8 digitos"}),
      email: z.string().email({message:"El email no tiene el formato requedido, ejmp: ejemplo@ejemplo.com"}),
      password: z.string(),
      image: z.string().nullable(),
      active: z.boolean().nullable(),
    });
    // valida
    try {
      userSchema.parse(user)
      this.watcher = false;
      return user;
    } catch (error) {
      this.watcher = true;
      if (error instanceof ZodError) {
        const errors = error.formErrors;
        Object.entries(errors.fieldErrors).forEach(([key, value], i) => {
          if(this.errors[i] === undefined) this.errors[i] = {attribute: '', message:''}
          this.errors[i].attribute = key.toString();
          this.errors[i].message = value.toString();
        })
      }
      return null;
    }
  };
  error = (): boolean | undefined => {
    return this.watcher;
  };
  getErrors = (): IErrorObject[] => {
    return this.errors;
  };
}
