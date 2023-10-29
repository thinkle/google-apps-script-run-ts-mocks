/* Make sure this matches our types in src/code-scanning/types */

export interface GoogleScriptUrl {
  getLocation(callback: (location: IUrlLocation) => void): void;
}
interface IUrlLocation {
  hash: string;
  parameter: { [key: string]: any };
  parameters: { [key: string]: any[] };
}

export const url: GoogleScriptUrl = {
  getLocation(cb) {
    const browserLocation = window.location;

    const urlSearchParams = new URLSearchParams(browserLocation.search);
    const params: { [key: string]: any[] } = {};
    for (const [key, value] of urlSearchParams.entries()) {
      if (!params[key]) {
        params[key] = [];
      }
      params[key].push(value);
    }

    const singleParams: { [key: string]: any } = {};
    Object.keys(params).forEach((key) => {
      singleParams[key] =
        params[key].length === 1 ? params[key][0] : params[key];
    });

    const location: IUrlLocation = {
      hash: browserLocation.hash,
      parameter: singleParams,
      parameters: params,
    };

    cb(location);
  },
};
