import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ConnectionOptions, ResultSetHeader } from "mysql2";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLExecuteAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLExecuteAdapter";

export class MySQLUserRepository implements UserRepository {
  private readonly dbConfig: DBConfig = new DBConfig();
  private readonly mysqlAdapter: MySQLAdapter = new MySQLAdapter();
  private readonly connOptions: ConnectionOptions = {
      host: this.dbConfig.mysqlPool.host,
      port: this.dbConfig.mysqlPool.port,
      user: this.dbConfig.mysqlPool.user,
      password: this.dbConfig.mysqlPool.password,
      database: this.dbConfig.mysqlPool.database,
    };
  /* -------------------------------------------------------------------------- */
  /*                    Cnsigue todos los usuarios de la base                   */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<string | User[]> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQueryWitoutParams("CALL sp_users_get_all();")

    if (exececuteQuery.hasError()) return exececuteQuery.getError();

    let userResponse = response as [User[], ResultSetHeader]
    return userResponse[0];
  };
  /* -------------------------------------------------------------------------- */
  /*                         Crea un usuario en la base                         */
  /* -------------------------------------------------------------------------- */
  create = async (user: User): Promise<string | User> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQuery("CALL sp_users_save(?,?,?,?,?,?);", [
      user.first_name,
      user.last_name,
      user.dni,
      user.email,
      user.password,
      user.image,
    ])

    if (exececuteQuery.hasError()) return exececuteQuery.getError();

    let userResponse = response as [User[], ResultSetHeader]
    return userResponse[0][0];
  };
  /* -------------------------------------------------------------------------- */
  /*                       Consigue un usuarios por email                       */
  /* -------------------------------------------------------------------------- */
  getByEmail = async (email: string): Promise<string | User | null> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQuery("CALL sp_users_get_by_email(?);", [email])

    if (exececuteQuery.hasError()) return exececuteQuery.getError();
    if (response === null) return null;

    let userResponse = response as [User[], ResultSetHeader]
    return userResponse[0][0];
  };
  /* -------------------------------------------------------------------------- */
  /*                         consigue un usuario por id                         */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<string | User | null> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQuery("CALL sp_users_get_by_id(?);", [id])

    if (exececuteQuery.hasError()) return exececuteQuery.getError();
    if (response === null) return null;

    let userResponse = response as [User[], ResultSetHeader]
    return userResponse[0][0];
  };
  /* -------------------------------------------------------------------------- */
  /*                            Actualiza un usuario                            */
  /* -------------------------------------------------------------------------- */
  update = async (id: number, user: User): Promise<string | User | null> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQueryWitoutRows("CALL sp_users_update(?,?,?,?,?);", [
      id,
      user.first_name,
      user.last_name,
      user.dni,
      user.image,
    ])

    if (exececuteQuery.hasError()) return exececuteQuery.getError();
    if (response === null) return null;

    let userResponse = response as ResultSetHeader
    if (userResponse.affectedRows === 0) return null
    return user;
  };
  /* -------------------------------------------------------------------------- */
  /*                              Anula un usuario                              */
  /* -------------------------------------------------------------------------- */
  delete = async (id: number): Promise<string | boolean> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQueryWitoutRows("CALL sp_users_delete(?);", [id])

    if (exececuteQuery.hasError()) return exececuteQuery.getError();
    if (response === null) return false;

    let userResponse = response as ResultSetHeader
    if (userResponse.affectedRows === 0) return false
    return true;
  };
}
