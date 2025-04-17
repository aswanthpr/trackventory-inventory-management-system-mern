import express ,{Application}  from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import env from './config/env.config';

import { connectDB } from './config/db.config';
import morgan from 
'morgan';
import cookieParser  from "cookie-parser";

import router from "./routes/routes";

const app:Application = express();

app.use(cors({
  origin: env.CLIENT_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
connectDB();
 
app.use("/",router);


app.listen(env?.PORT,() => { 
  console.log('\x1b[35m%s\x1b[0m',`Express is listening at http://localhost:${env?.PORT}`) 
  return ;
});
   