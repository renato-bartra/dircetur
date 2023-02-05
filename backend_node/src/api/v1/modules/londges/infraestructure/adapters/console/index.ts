import { MySQLSharedRepositori } from "../../../../shared/infraestructure/implementations/MySQL/MySQLSharedRepositori";
import { PasswordBcrypt } from "../../../../shared/infraestructure/implementations/PasswordBcript";
import { LondgeCreatorUseCase, LondgeGetAllUseCase, LondgeUpdateUseCase } from "../../../application/usecases";
import { Londge } from "../../../domain/entities/Londge";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { MySQLLondgeRepository } from "../../implementations/MySQL/MySQLLondgeRepository";
import { ZodLondgeValidator } from "../../implementations/Zod/ZodLondgeManager";

const consoleCreate = async () => {
  // const userData = new InMemoryUserRepository()
  // console.log(userData.userData);
  const repo = new MySQLLondgeRepository();
  const sharedRepo = new MySQLSharedRepositori();
  const passManager = new PasswordBcrypt(11);
  const validator = new ZodLondgeValidator();
  const createUseCase = new LondgeGetAllUseCase(repo);
  const londge: Londge = {
    id: 1,
    email: "rustica@rustica.com.pe",
    password: "rustica",
    image: null,
    trade_name: "Rustica",
    legal_name: "Inversiones Inmobiliaria Tarapoto SAC",
    legal_representative: "Oliva Guerrero Paul Geancarlo",
    certificate: "Oliva Guerrero Paul Geancarlo",
    ruc: 20572278779,
    city_id: 1762,
    clase_id: 2,
    stars: 0,
    street: "Maronilla III - Sec. Cacatachi (Rústica)",
    phone: "940031566",
    latitude: null,
    longitude: null,
    web_page: "http://www.rusticahoteles.com",
    reservation_email: "rustica@rustica.com.pe"
  };
  const data: LondgeListener[] = await createUseCase.get();
  // console.log('Esto el log en console adapter' , data);
  console.log(data);
};
consoleCreate();
