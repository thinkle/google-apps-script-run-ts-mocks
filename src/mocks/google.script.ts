import { GoogleScriptHost, host } from "./google.script.host";
import { GoogleScriptUrl, url } from "./google.script.url";

interface MockApi {
  [key: string]: Function;
}
type ArbitraryFunction = (...args: any[]) => void;

class GoogleScriptRunMock {
  private successCB: Function | null = null;
  private failureCB: Function | null = null;
  [key: string]: ArbitraryFunction | Function | null;
  withFailureHandler(callback: Function) {
    this.failureCB = callback;
    return this;
  }

  withSuccessHandler(callback: Function) {
    this.successCB = callback;
    return this;
  }

  private runFunction(f: Function, args: any[]) {
    const delay = Math.random() * 1000 + 300;
    const successCB = this.successCB;
    const failureCB = this.failureCB;
    this.successCB = null;
    this.failureCB = null;
    setTimeout(() => this.doRunFunction(f, args, successCB, failureCB), delay);
  }

  private doRunFunction(f: Function, args: any[], onSuccess, onFailure) {
    try {
      const result = f(...args);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      if (onFailure) {
        onFailure(e);
      }
    }
  }

  addMockApi(mockApi: MockApi) {
    Object.keys(mockApi).forEach((key) => {
      this[key] = (...args: any[]) => {
        this.runFunction(mockApi[key], args);
      };
    });
  }
}

export class GoogleMock {
  public script: {
    run: GoogleScriptRunMock;
    host: GoogleScriptHost;
    url: GoogleScriptUrl;
  };

  constructor(mockApi: MockApi) {
    this.script = { run: new GoogleScriptRunMock(), host, url };
    this.script.run.addMockApi(mockApi);

    // TODO: add mock for url
    // TODO: add mock for host
  }
}
