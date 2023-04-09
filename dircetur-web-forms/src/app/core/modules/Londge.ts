import { City } from "./City";
import { Clase } from "./Clase";

export interface Londge {
  id: number;
  city: City
  clase: Clase;
  email: string;
  trade_name: string;
  legal_name: string;
  legal_representative: string|null;
  certificate: string|null;
  ruc: number;
  image: string|null;
  stars: number;
  street: string;
  phone: string;
  latitude: string|null;
  longitude: string|null;
  web_page: string|null;
  reservation_email: string|null
}
