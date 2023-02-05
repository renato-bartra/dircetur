import { Entity } from "../../../shared/domain/entities/Entity";

export interface User extends Entity{
  first_name: string,
  last_name: string|null,
  dni: string,
  email: string,
  password: string,
  image: string|null,
}