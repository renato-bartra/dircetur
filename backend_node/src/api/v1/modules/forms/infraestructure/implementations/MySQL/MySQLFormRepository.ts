import { Pool, PoolOptions, ResultSetHeader } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../../modules/shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { FormsListener, 
  FormsLondge, 
  FormListener, 
  Form, 
  Chapter6 
} from "../../../domain/entities";
import { FormsRepository } from "../../../domain/repositories/FormsRepository";

export class MySQLFormRepositori implements FormsRepository {
  private errorValidate: boolean = false;
  private errors: string = '';
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
  
  getAllByDate = async (start_date: string, end_date: string): Promise<FormsListener[]> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [FormsListener[], Error] = await promisePool
      .promise()
      .execute("CALL sp_forms_get_all_by_date(?,?);",[start_date, end_date])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    return rows;
  }

  getAllByLondge = async (londge_id: number): Promise<FormsLondge[] | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [FormsLondge[], Error] = await promisePool
      .promise()
      .execute("CALL sp_forms_get_by_londge_id(?);",[londge_id])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows;
  }

  getById = async (id: number): Promise<FormListener | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [FormListener[], Error] = await promisePool
      .promise()
      .execute("CALL sp_forms_get_by_id(?);",[id])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows[0];
  }

  create = async (form: Form, londge_id: number): Promise<boolean> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader] = await promisePool
      .promise()
      .execute("CALL sp_forms_save(?,?,?,?,?,?,?,?);",[
        londge_id, 
        form.chapter2, 
        form.chapter3,
        form.chapter4_1,
        form.chapter4_2,
        form.chapter5,
        form.chapter6,
        form.documented_at
      ])
      .then((rows) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(rows.affectedRows === 0) return false;
    return true;
  }

  getLastChapter6ByLondge = async (ruc: number, date: string): Promise<Chapter6 | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [Chapter6[], Error] = await promisePool
      .promise()
      .execute("CALL sp_form_get_last_chapter6_by_londge(?,?);",[ruc, date])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(rows[0] === undefined) return null;
    return rows[0];
  }

  delete = async (id: number): Promise<boolean> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader] = await promisePool
      .promise()
      .execute("CALL sp_forms_delete(?);",[id])
      .then((rows) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(rows.affectedRows === 0) return false;
    return true;
  }

  error = (): boolean => this.errorValidate;
  getError = (): string => this.errors;
}