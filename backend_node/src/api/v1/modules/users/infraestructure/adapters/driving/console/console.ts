import { IResponseObject } from "src/api/v1/modules/shared/domain/repositories/IResponseObject";
import { UserController } from "../../../../application/controllers";
import { User } from "../../../../domain/entities/User";
import { InMemoryUserRepository } from "../../../implementations/inMemory/InMemoryUserrepository";

const consoleCreate = async () => { 
  // const userData = new InMemoryUserRepository()
  // console.log(userData.userData);
  const userCreatorUseCase = new UserController()
  const user: User = {
    id: 3,
    first_name: 'Prueba',
    last_name: 'Prueba Prueba',
    dni: 'prueba',
    email: 'rbr1594@gmail.com',
    password: '71721506',
    image: null,
    active: null
  };
  const data: IResponseObject = await userCreatorUseCase.login(user.email, user.password);
  // console.log('Esto el log en console adapter ', data);
  console.log(data);
}
consoleCreate();
