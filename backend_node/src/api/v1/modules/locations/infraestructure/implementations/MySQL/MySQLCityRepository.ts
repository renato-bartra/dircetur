import { ConnectionOptions } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { City } from "../../../domain/entities/City";
import { CityRepository } from "../../../domain/Repositories/CitiyRepository";

export class MySQLCityRepository implements CityRepository {
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

  getAll = async (): Promise<City[]> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows]: [City[]] = await promiseConn
      .promise()
      .execute('CALL sp_cities_get_all()')
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows;
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error.sqlMessage
      });
    promiseConn.end();
    return rows;
  };

  getById = async (id: number): Promise<City | null> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows, error]: [City[], Error] = await promiseConn
      .promise()
      .execute('CALL sp_cities_get_by_id(?);', [id])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows;
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error.sqlMessage
      });
    promiseConn.end();
    if (error.message) return null;
    if (!rows[0]) return null;
    return rows[0];
  };

  error = (): boolean => this.errorValidate;
  getErrors = (): string => this.errors;
}
