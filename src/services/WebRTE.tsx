import axios, { AxiosResponse } from 'axios';
import { Buffer } from 'buffer';

export default class WebRTE {

  baseUrl: string
  static basePort: string = ":771"
  static process_name: string = "webrtc_daemon.self"
  static timeout: number = 3000

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  GetConfig() {
    //TODO: use this to get url+port from globals
  }

  GetProcessList() {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/list`,
      { timeout: WebRTE.timeout }
    );
  }

  GetProcessInfo (pid: string) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/info?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  GetProcessMaps (pid: string) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/mapping?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  ReadMemory(pid: string, address: string, length: number) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/read?pid=${pid}&address=${address}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  WriteMemory(pid: string, address: string, data: any, length: number) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/write?pid=${pid}&address=${address}&data=${data}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  AllocateMemory(pid: string, length: number) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/alloc?pid=${pid}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  FreeMemory(pid: string, address: string, length: number) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/free?pid=${pid}&address=${address}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  PauseProcess(pid: string) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/pause?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  ResumeProcess(pid: string) {
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/resume?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  Notify(messageType: number, message: string) {
    console.log(`${this.baseUrl}${WebRTE.basePort}/notify?messageType=${messageType}&message=${Buffer.from(message + "\x00").toString('base64')}`)
    return axios.get(
      `${this.baseUrl}${WebRTE.basePort}/notify?messageType=${messageType}&message=${Buffer.from(message + "\x00").toString('base64')}`,
      { timeout: WebRTE.timeout }
    );
  };

}
