import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { Pool, PoolOptions, QueryError, ResultSetHeader } from "mysql2";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { DBConfig } from "../../../../../config/DBConfig";

export class MySQLUserRepository implements UserRepository {
  private readonly dbConfig: DBConfig = new DBConfig();
  private readonly mysqlAdapter: MySQLAdapter = new MySQLAdapter();
  private readonly userPool: PoolOptions = {
    host: this.dbConfig.mysqlPool.host,
    port: this.dbConfig.mysqlPool.port,
    user: this.dbConfig.mysqlPool.user,
    password: this.dbConfig.mysqlPool.password,
    database: this.dbConfig.mysqlPool.database,
    connectionLimit: this.dbConfig.mysqlPool.connectionLimit,
    queueLimit: this.dbConfig.mysqlPool.queueLimit
  };
  /* -------------------------------------------------------------------------- */
  /*                    Cnsigue todos los usuarios de la base                   */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<string | User[]> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    // mysql 2 usa esta sintaxis para hacer un tipado fuerte a sus resultados
    // de la base de datos
    const [rows]: [User[]] = await promisePool
      .promise()
      .execute("CALL sp_users_get_all();")
      .then(([rows, fields]) => rows)
      .catch((error) => {
        return error;
      });
    promisePool.end();
    return rows;
  };
  /* -------------------------------------------------------------------------- */
  /*                         Crea un usuario en la base                         */
  /* -------------------------------------------------------------------------- */
  create = async (user: User): Promise<string | User> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [User[], QueryError] = await promisePool
      .promise()
      .execute("CALL sp_users_save(?,?,?,?,?,?);", [
        user.first_name,
        user.last_name,
        user.dni,
        user.email,
        user.password,
        user.image,
      ])
      .then(([rows, fields]) => rows)
      .catch(error => {
        return error;
      });
    promisePool.end();
    if(error.code) return error.message;
    return rows[0];
  };
  /* -------------------------------------------------------------------------- */
  /*                       Consigue un usuarios por email                       */
  /* -------------------------------------------------------------------------- */
  getByEmail = async (email: string): Promise<string | User | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [User[]] = await promisePool
      .promise()
      .execute("CALL sp_users_get_by_email(?);", [email])
      .then(([rows, fields]) => rows)
      .catch(error => {
        return error;
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows[0];
  };
  /* -------------------------------------------------------------------------- */
  /*                         consigue un usuario por id                         */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<string | User | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [User[], QueryError] = await promisePool
      .promise()
      .execute("CALL sp_users_get_by_id(?);", [id])
      .then(([rows, fields]) => rows)
      .catch(error => {
        return error;
      });
    promisePool.end();
    if(error.code) return error.message;
    if(!rows[0]) return null;
    return rows[0];
  };
  /* -------------------------------------------------------------------------- */
  /*                            Actualiza un usuario                            */
  /* -------------------------------------------------------------------------- */
  update = async (id: number, user: User): Promise<string | User | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader] = await promisePool
      .promise()
      .execute("CALL sp_users_update(?,?,?,?,?);", [
        id,
        user.first_name,
        user.last_name,
        user.dni,
        user.image,
      ])
      .then((rows) => rows)
      .catch(error => error);
    promisePool.end();
    if(rows.affectedRows === 0) return null;
    return user;
  };
  /* -------------------------------------------------------------------------- */
  /*                              Anula un usuario                              */
  /* -------------------------------------------------------------------------- */
  delete = async (id: number): Promise<string | boolean> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader[]] = await promisePool
      .promise()
      .execute("CALL sp_users_delete(?);", [id])
      .then((rows) => rows)
      .catch(error => {
        return error;
      });
    promisePool.end();
    if(rows[0].affectedRows === 0) return false;
    return true;
  };
}
