import { Pool, PoolOptions, QueryError, ResultSetHeader } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { Londge } from "../../../domain/entities/Londge";
import { LondgeListener } from "../../../domain/entities/LondgeListener";
import { LondgeLogin } from "../../../domain/entities/LondgeLogin";
import { LondgeRepository } from "../../../domain/repositories/LondgeRepository";

export class MySQLLondgeRepository implements LondgeRepository {
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

  getAll = async (): Promise<LondgeListener[]> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [LondgeListener[], Error] = await promisePool
      .promise()
      .execute("CALL sp_londges_get_all();")
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch((error) => {
        this.errorValidate = true;
        this.errors = String(error);
        return error;
      });
    promisePool.end();
    return rows;
  }

  getById = async (id: number): Promise<LondgeListener | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [LondgeListener[], QueryError] = await promisePool
      .promise()
      .execute("CALL sp_londges_get_by_id(?);", [id])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch(error => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows[0];
  }

  getByEmail = async (email: string): Promise<LondgeLogin | null> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [LondgeLogin[]] = await promisePool
      .promise()
      .execute("CALL sp_londges_get_by_email(?);", [email])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch(error => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(!rows[0]) return null;
    return rows[0];
  }

  create = async (londge: Londge): Promise<LondgeListener> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows, error]: [LondgeListener[], QueryError] = await promisePool
      .promise()
      .execute("CALL sp_londges_save(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [
        londge.email,
        londge.password,
        londge.city_id,
        londge.clase_id,
        londge.trade_name,
        londge.legal_name,
        londge.legal_representative,
        londge.certificate,
        londge.ruc,
        londge.stars,
        londge.street,
        londge.phone,
        londge.latitude,
        londge.longitude,
        londge.web_page,
        londge.reservation_email
      ])
      .then(([rows, fields]) => {
        this.errorValidate = false;
        return rows
      })
      .catch(error => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    return rows[0];
  }

  update = async (id: number, londge: Londge): Promise<boolean> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader] = await promisePool
      .promise()
      .execute("CALL sp_londge_update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [
        id,
        londge.city_id,
        londge.clase_id,
        londge.trade_name,
        londge.legal_name,
        londge.legal_representative,
        londge.certificate,
        londge.ruc,
        londge.stars,
        londge.street,
        londge.phone,
        londge.latitude,
        londge.longitude,
        londge.web_page,
        londge.reservation_email
      ])
      .then((rows) => {
        this.errorValidate = false;
        return rows;
      })
      .catch(error => {
        this.errorValidate = true;
        this.errors = String(error.sqlMessage);
        return error;
      });
    promisePool.end();
    if(rows.affectedRows === 0) return false;
    return true;
  }

  delete = async (id: number): Promise<boolean> => {
    const promisePool: Pool = await this.mysqlAdapter.createPool(this.userPool);
    const [rows]: [ResultSetHeader] = await promisePool
      .promise()
      .execute("CALL sp_users_delete(?);", [id])
      .then((rows) => {
        this.errorValidate = true;
        return rows;
      })
      .catch(error => {
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