import { Entity } from "../../../shared/domain/entities/Entity";

export interface Londge extends Entity {
  city_id: number,
  clase_id: number,
  password: string,
  email: string,
  trade_name: string,
  legal_name: string,
  legal_representative: string,
  certificate: string,
  ruc: number,
  image?: string | null,
  stars: number,
  street: string,
  phone: string | null,
  latitude: string | null,
  longitude: string | null,
  web_page: string | null,
  reservation_email: string | null,
  last_login?: Date
}
