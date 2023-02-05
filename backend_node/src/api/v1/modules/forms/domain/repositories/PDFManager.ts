import { FormListener } from "../entities";

export interface PDFManager {
  create: (londge_id: number, form: FormListener) => Promise<string>;
  delete: (londge_id: number) => Promise<boolean>;
  getMounth: (date: string) => string;
  error: () => boolean;
  getError: () => string;
}