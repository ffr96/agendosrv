import jwt from "jsonwebtoken";
import mUser from "../schema/users";
import { Request, Response, NextFunction } from "express";
import { parseString, isJwt } from "../utils/parsers";

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string,
    username: string
  }
}

export const tokenExtractor = async(request: Request, _response: Response, next: NextFunction) => {
  try {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        request.token = authorization.substring(7);
        const decodedToken = jwt.verify(request.token, parseString(process.env.CODE));
        if (isJwt(decodedToken)) {
          request.user = await mUser.findById(decodedToken.id);
        } else {
          request.user = null;
        }
    }
    else { request.token = null; }
  } catch(e) {
    console.error(e);
  }

  next();
};
