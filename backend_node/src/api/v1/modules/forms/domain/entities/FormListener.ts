import { Form } from "./Form";
import { FormsListener } from "./FormsListener";

export interface FormListener
  extends Omit<FormsListener, "documented_at" | "status" | "londge_id" | "form_id">,
    Omit<Form, "londge_id"> {
  email: string,
  legal_name: string;
  legal_representative: string,
  stars: number;
  certificate: string;
  street: string;
  phone: string;
  latitude: string|null;
  longitude: string|null;
  web_page: string | null;
  reservation_email: string | null;
}
