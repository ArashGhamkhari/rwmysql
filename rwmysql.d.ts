import {Pool, PoolConnection} from "mysql";

export declare class RWMysql {
  constructor(pool: Pool, reconnect?: number, queryRetry?: number)

  read(sql: string, params: Array<any>): Promise<Array<Object>>

  write(sql: string, params: Array<any>): Promise<{ effectedRows: number, changedRows: number, insertId: number }>

  read(sql: string, params: Array<any>): Promise<any>

  getConnection(): Promise<PoolConnection>
}
