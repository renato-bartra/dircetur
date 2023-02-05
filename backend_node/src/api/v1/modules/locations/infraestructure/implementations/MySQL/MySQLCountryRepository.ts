import { ConnectionOptions } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../../modules/shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { Country } from "../../../domain/entities/County";
import { CountryRepository } from "../../../domain/Repositories/CountryRepository";

export class MySQLCountryRepository implements CountryRepository {
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
  getAll = async (): Promise<Country[]> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows]: [Country[]] = await promiseConn
      .promise()
      .execute('CALL sp_countries_get_all()')
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
  }
  getById = async (id: number): Promise<Country | null> => {
    const promiseConn = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows, error]: [Country[], Error] = await promiseConn
      .promise()
      .execute('CALL sp_countries_get_by_id(?);', [id])
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
  }
  
  error = (): boolean => this.errorValidate;
  getErrors = (): string => this.errors;
}