import { Clase } from "../../../clases/domain/entities/Clase";
import { City } from "../../../locations/domain/entities/City";
import { Londge } from "./Londge";

export interface LondgeLogin
  extends Omit<
    Londge,
    | "clase_id"
    | "city_id"
    | "last_login"
    | "deleted_at"
    | "created_at"
    | "updated_at"
  > {
  clase: Clase;
  city: City;
}