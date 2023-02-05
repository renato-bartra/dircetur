import { DomainRepository } from "../../../shared/domain/repositories/DomainRepository";
import { Londge } from "../entities/Londge";
import { LondgeListener } from "../entities/LondgeListener";
import { LondgeLogin } from "../entities/LondgeLogin";

export interface LondgeRepository extends DomainRepository{
  getAll: () => Promise<LondgeListener[]>;
  getById: (id: number) => Promise<LondgeListener | null>;
  getByEmail: (email: string) => Promise<LondgeLogin | null>
  create: (londge: Londge) => Promise<LondgeListener>;
  update: (id: number, londge: Londge) => Promise<boolean>;
  delete: (id: number) => Promise<boolean>;
  error: () => boolean;
  getError: () => string;
}