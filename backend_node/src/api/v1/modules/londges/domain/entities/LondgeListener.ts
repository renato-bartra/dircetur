import { Clase } from "../../../clases/domain/entities/Clase";
import { City } from "../../../locations/domain/entities/City";
import { Londge } from "./Londge";

export interface LondgeListener
  extends Omit<
    Londge,
    | "clase_id"
    | "city_id"
    | "password"
    | "last_login"
    | "deleted_at"
    | "created_at"
    | "updated_at"
  > {
  clase: Clase;
  city: City;
}
