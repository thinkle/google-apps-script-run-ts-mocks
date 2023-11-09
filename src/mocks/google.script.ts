import { GoogleScriptHost, host } from "./google.script.host";
import { GoogleScriptUrl, url } from "./google.script.url";

interface MockApi {
  [key: string]: Function;
}
type ArbitraryFunction = (...args: any[]) => void;

class GoogleScriptRunMock {
  private successCB: Function | null = null;
  private failureCB: Function | null = null;
  private verbose: boolean;
  [key: string]: ArbitraryFunction | Function | boolean | null;
  withFailureHandler(callback: Function) {
    this.failureCB = callback;
    return this;
  }

  withSuccessHandler(callback: ArbitraryFunction) {
    this.successCB = callback;
    return this;
  }

  private runFunction(f: Function, args: any[]) {
    const delay = Math.random() * 1000 + 300;
    const successCB = this.successCB;
    const failureCB = this.failureCB;
    this.successCB = null;
    this.failureCB = null;
    if (this.verbose) {
      console.log(
        `GoogleMock will run function ${f.name} after ${delay}ms with args`,
        args
      );
    }
    setTimeout(() => this.doRunFunction(f, args, successCB, failureCB), delay);
  }

  private doRunFunction(
    f: Function,
    args: any[],
    onSuccess: Function | null,
    onFailure: Function | null
  ) {
    if (this.verbose) {
      console.log(`GoogleMock running function ${f.name} with args`, args);
    }
    try {
      const result = f(...args);
      if (this.verbose) {
        console.log(
          `GoogleMock function ${f.name} returned `,
          result,
          ` calling`,
          onSuccess
        );
      }
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      if (this.verbose) {
        console.log(
          `GoogleMock function ${f.name} threw ${e}, calling`,
          onFailure
        );
      }
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

  constructor(verbose: boolean) {
    this.verbose = verbose;
  }
}

export class GoogleMock {
  public script: {
    run: GoogleScriptRunMock;
    host: GoogleScriptHost;
    url: GoogleScriptUrl;
  };

  constructor(mockApi: MockApi, verbose = false) {
    this.script = { run: new GoogleScriptRunMock(verbose), host, url };
    this.script.run.addMockApi(mockApi);

    // TODO: add mock for url
    // TODO: add mock for host
  }
}
