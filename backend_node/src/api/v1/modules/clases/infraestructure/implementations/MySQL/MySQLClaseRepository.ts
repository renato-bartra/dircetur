import { ConnectionOptions, QueryError } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { Clase } from "../../../domain/entities/Clase";
import { ClaseRepository } from "../../../domain/repositories/ClaseRepository";

export class MySQLClaseRepositori implements ClaseRepository {
  private errorValidate: boolean = false;
  private errors: string = "";
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
  /*                               Get all clases                               */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<Clase[]> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows, error]: [Clase[], QueryError] = await promiseConn
      .promise()
      .execute("CALL sp_clases_get_all();")
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows;
      })
      .catch((error) => error);
    if (error.message) {
      this.errorValidate = true;
      this.errors = error.message;
    }
    promiseConn.end();
    return rows;
  };
  /* -------------------------------------------------------------------------- */
  /*                            Get by id all clases                            */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<Clase | null> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows, error]: [Clase[], QueryError] = await promiseConn
      .promise()
      .execute("CALL sp_clases_get_by_id (?);", [id])
      .then(([rows, field]) => rows)
      .catch((error) => error);
    promiseConn.end();
    if (error.message) {
      this.errorValidate = true;
      this.errors = error.message;
      return null;
    }
    if (!rows[0]) return null;
    return rows[0];
  };

  error = (): boolean => this.errorValidate;
  getError = (): string => this.errors;
}
