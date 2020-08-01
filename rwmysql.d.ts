import {Pool, PoolConnection} from "mysql";

interface rwmysql {
  read(sql: string, params: Array<any>): Promise<Array<Object>>

  write(sql: string, params: Array<any>): Promise<{ effectedRows: number, changedRows: number, insertId: number }>

  read(sql: string, params: Array<any>): Promise<any>

  getConnection(): Promise<PoolConnection>
}

declare function RWMysql(pool: Pool, reconnect: number | null, queryRetry: number | null): rwmysql

export = RWMysql
