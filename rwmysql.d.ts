import {Pool, PoolConnection} from "mysql";

interface RWMysql {
  constructor(pool: Pool, reconnect: number | null, queryRetry: number | null)

  read(sql: string, params: Array<any>): Promise<Array<Object>>

  write(sql: string, params: Array<any>): Promise<{ effectedRows: number, changedRows: number, insertId: number }>

  read(sql: string, params: Array<any>): Promise<any>

  getConnection(): Promise<PoolConnection>
}

export = RWMysql
