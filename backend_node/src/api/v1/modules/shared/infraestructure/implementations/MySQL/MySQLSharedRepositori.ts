import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../adapters/MySQL/MySQLAdapter";
import { SharedRepository } from "../../../domain/repositories/SharedRepository";
import { ConnectionOptions, ResultSetHeader } from "mysql2";
import { User } from "../../../../users/domain/entities/User";

export class MySQLSharedRepositori implements SharedRepository {
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

  changePassword = async (id: number, password: string): Promise<boolean> => {
    const connection = await this.mysqlAdapter.createConection(
      this.connOptions
    );
    const [rows]: [ResultSetHeader] = await connection
      .promise()
      .execute("CALL sp_change_password_by_id(?,?)", [id, password])
      .then((rows) => {
        this.errorValidate = false;
        return rows;
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error.sqlMessage
      });
    connection.end();
    if(rows.affectedRows === 0) return false;
    return true;
  };

  getByEmail = async (email: string): Promise<User | null> => {
    const promisePool = await this.mysqlAdapter.createConection(this.connOptions);
    const [rows]: [User[]] = await promisePool
      .promise()
      .execute("CALL sp_users_get_by_email(?);", [email])
      .then(([rows]) => {
        this.errorValidate = false;
        this.errors = "";
        return rows;
      })
      .catch(error => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error.sqlMessage
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows[0];
  } 

  error = (): boolean => this.errorValidate;
  getError = (): string => this.errors; 
}
