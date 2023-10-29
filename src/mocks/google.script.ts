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
    setTimeout(() => this.doRunFunction(f, args), delay);
  }

  private doRunFunction(f: Function, args: any[]) {
    try {
      const result = f(...args);
      if (this.successCB) {
        this.successCB(result);
        this.successCB = null;
      }
    } catch (e) {
      if (this.failureCB) {
        this.failureCB(e);
        this.failureCB = null;
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
