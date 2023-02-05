import { Chapter6, Form, FormListener, FormsListener, FormsLondge } from "../entities";

export interface FormsRepository {
  getAllByDate: (start_date: string, end_date: string) => Promise<FormsListener[]>;
  getAllByLondge: (londge_id: number) => Promise<FormsLondge[] | null>;
  getById: (id: number) => Promise<FormListener | null>;
  create: (form: Form, londge_id: number) => Promise<boolean>;
  getLastChapter6ByLondge: (ruc: number, date:string)=> Promise<Chapter6 | null>;
  delete: (id: number) => Promise<boolean>;
  error: () => boolean;
  getError: () => string;
}