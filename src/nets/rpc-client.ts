import * as Amino from '@irisnet/amino-js';
import { base64ToBytes, bytesToBase64 } from '@tendermint/belt';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Utils from '../utils';
import SdkError from '../errors';
import * as is from 'is_js';

export default class RpcClient {
  instance: AxiosInstance;

  /**
   *
   * @param url Rpc address of irishub node
   * @param config The other configurations, refer to { AxiosRequestConfig }
   * @returns { RpcClient }
   */
  constructor(config: AxiosRequestConfig) {
    if (is.empty(config)) {
      throw new Error('RpcClient Config not initialized');
    }
    if (is.empty(config.baseURL)) {
      throw new Error('baseURL of RpcClient cannot be empty');
    }
    if (is.empty(config.timeout)) {
      config.timeout = 2000; // Set default timeout
    }

    config.url = '/'; // Fixed url

    this.instance = axios.create(config);
  }

  /**
   * Post Tendermint RPC request
   *
   * @param method Tendermint RPC method
   * @param params Request params
   * @returns
   */
  request(method: string, params: object = {}) {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: 'jsonrpc-client',
      method: method,
      params: params,
    });

    return this.instance
      .request({
        params: data,
      })
      .then(response => {
        const res = response.data;

        // Internal error
        if (res.error) {
          const err = new SdkError(res.error.message);
          err.code = res.error.code;
          err.log = res.error.log;
          throw err;
        }

        return res.result;
      });
  }
}