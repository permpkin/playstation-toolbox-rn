import axios, { AxiosResponse } from 'axios';
import { Buffer } from 'buffer';

export default class WebRTE {

  static baseUrl: string = "http://10.0.0.254" //TODO: get globals
  static basePort: string = ":771"
  static process_name: string = "webrtc_daemon.self"
  static timeout: number = 3000

  static GetConfig() {
    //TODO: use this to get url+port from globals
  }

  static GetProcessList() {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/list`,
      { timeout: WebRTE.timeout }
    );
  }

  static GetProcessInfo (pid: string) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/info?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  static GetProcessMaps (pid: string) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/mapping?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  static ReadMemory(pid: string, address: string, length: number) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/read?pid=${pid}&address=${address}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  static WriteMemory(pid: string, address: string, data: any, length: number) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/write?pid=${pid}&address=${address}&data=${data}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  static AllocateMemory(pid: string, length: number) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/alloc?pid=${pid}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  static FreeMemory(pid: string, address: string, length: number) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/free?pid=${pid}&address=${address}&length=${length}`,
      { timeout: WebRTE.timeout }
    );
  };

  static PauseProcess(pid: string) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/pause?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  static ResumeProcess(pid: string) {
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/resume?pid=${pid}`,
      { timeout: WebRTE.timeout }
    );
  };

  static Notify(messageType: number, message: string) {
    console.log(`${WebRTE.baseUrl}${WebRTE.basePort}/notify?messageType=${messageType}&message=${Buffer.from(message + "\x00").toString('base64')}`)
    return axios.get(
      `${WebRTE.baseUrl}${WebRTE.basePort}/notify?messageType=${messageType}&message=${Buffer.from(message + "\x00").toString('base64')}`,
      { timeout: WebRTE.timeout }
    );
  };

}
