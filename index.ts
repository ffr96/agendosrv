import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { config } from "dotenv";
import { tokenExtractor } from './mdw/tokenExt';

import requestRouter from './router/requestRouter';
import patientsRouter from './router/patientsRouter';
import userRouter from './router/userRouter';
import { parseString } from "./utils/parsers";
config();
const app = express();

const mongodb = parseString(process.env.MONGODB_URI);

mongoose.connect(mongodb, <mongoose.ConnectOptions>{ useNewUrlParser: true, useUnifiedTopology:true, })
  .then(() => {
    console.log('connected to mongo');
  })
  .catch((e)=> {
    console.log(`can't connect to mongo ${e}`);
  });

app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan('combined'));
app.use(express.json());
app.use(tokenExtractor);
app.use('/api/p', patientsRouter);
app.use('/api/u', userRouter);
app.use(requestRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`srv running on ${PORT}`);
});