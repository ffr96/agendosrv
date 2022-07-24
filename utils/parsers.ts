import { JwtPayload } from "jsonwebtoken";
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string,
    username: string
  }
}

export const parseString = (str: unknown) : string => {
  if (!str || !isString(str)) {
    throw new Error('Error during parse: Not a string' + str);
  }
  return str;
};

const isString = (str: unknown) : str is string => {
  return typeof str === 'string' || str instanceof String;
};

export const isJwt = (obj:JwtPayload | string) : obj is JwtPayload => {
  if (obj) {
    if (isString(obj)) {
      return false;
    } 
    if (obj.username != undefined && obj.iat != undefined) {
      return true;
    }
    return false;
  }
  return false;
};