"use strict";

const EventEmitter = require('events').EventEmitter;

class RWMysql extends EventEmitter {

  /**
   * @type {Pool}
   * @private
   */
  _pool;

  /**
   * @type {?number}
   * @private
   */
  _reconnect = 1000;

  /**
   * @type {?number}
   * @private
   */
  _queryRetry = 1000;

  /**
   * @param {Pool} pool
   * @param {number|null} reconnect
   * @param {number|null} queryRetry
   */
  constructor(pool, reconnect = null, queryRetry = null) {
    super();

    this._pool = pool;

    if (reconnect !== null)
      this._reconnect = reconnect;

    if (queryRetry !== null)
      this._queryRetry = queryRetry;
  }

  /**
   * @param {string} sql
   * @param {Array<*>} params
   * @return {Promise<Array<Object>>}
   */
  async read(sql, params = []) {
    return this.query(sql, params);
  }

  /**
   * @param {string} sql
   * @param {Array<*>} params
   * @return {Promise<{effectedRows: number, changedRows: number, insertId: number}>}
   */
  async write(sql, params = []) {
    const results = await this.query(sql, params);

    return {
      effectedRows: results.effectedRows ? results.effectedRows : 0,
      changedRows: results.changedRows ? results.changedRows : 0,
      insertId: results.insertId ? results.insertId : 0
    };
  }

  /**
   * @param {string} sql
   * @param {Array<*>} params
   * @return {Promise<*>}
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this._query(sql, params, (err, results) => err ? reject(err) : resolve(results));
    });
  }

  /**
   * @return {Promise<PoolConnection>}
   */
  async getConnection() {
    return new Promise((resolve, reject) => {
      this._getConnection((err, conn) => err ? reject(err) : resolve(conn));
    });
  }

  /**
   * @param {string} sql
   * @param {Array<*>} params
   * @param {Function} callback
   * @private
   */
  _query(sql, params, callback) {
    this.getConnection().then(conn => {

      conn.query(sql, params, (err, results) => {
        conn.release();

        if (!err)
          return callback(null, results);

        if (this._queryRetry)
          setTimeout(() => this._query(sql, params, callback), this._queryRetry);
        else
          callback(err, null);

        this.emit('error', err);
      });

    }).catch(callback);
  }

  /**
   * @param {Function} callback
   * @private
   */
  _getConnection(callback) {
    this._pool.getConnection((err, conn) => {

      if (!err)
        return callback(null, conn);

      if (this._reconnect)
        setTimeout(() => this._getConnection(callback), this._reconnect);
      else
        callback(err, null);

      this.emit('error', err);
    });
  }

}

module.exports = RWMysql;
