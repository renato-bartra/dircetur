import { ConnectionOptions, ResultSetHeader } from "mysql2";
import { DBConfig } from "../../../../../config/DBConfig";
import { MySQLAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLAdapter";
import { Clase } from "../../../domain/entities/Clase";
import { ClaseRepository } from "../../../domain/repositories/ClaseRepository";
import { MySQLExecuteAdapter } from "../../../../shared/infraestructure/adapters/MySQL/MySQLExecuteAdapter";

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
    this.errorValidate = false;
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQueryWitoutParams("CALL sp_clases_get_all();")

    if (exececuteQuery.hasError()) {
      this.errorValidate = true;
      this.errors = exececuteQuery.getError();
    };

    let claseResponse = response as [Clase[], ResultSetHeader]
    return claseResponse[0];
  };
  /* -------------------------------------------------------------------------- */
  /*                            Get by id all clases                            */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<Clase | null> => {
    const exececuteQuery: MySQLExecuteAdapter = new MySQLExecuteAdapter(this.mysqlAdapter, this.connOptions);
    let response = await exececuteQuery.exececuteQuery("CALL sp_clases_get_by_id(?);", [id])

    if (exececuteQuery.hasError()) {
      this.errorValidate = true;
      this.errors = exececuteQuery.getError();
      return null;
    };
    if (response === null) return null;

    let claseResponse = response as [Clase[], ResultSetHeader]
    return claseResponse[0][0];
  };

  error = (): boolean => this.errorValidate;
  getError = (): string => this.errors;
}
