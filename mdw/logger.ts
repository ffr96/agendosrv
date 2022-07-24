//import { Request, Response } from 'express';
const infoLogger = ( next: () => void, ...params: any[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  console.log(...params);
  next();
};

export default { infoLogger };