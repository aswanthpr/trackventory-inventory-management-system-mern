import express  from 'express';
import dotevn  from 'dotenv';
import cors, { CorsOptions } from 'cors';
import { env } from './config/env.config';
import { connectDB } from './config/db.config';
dotevn.config();

const app = express();

app.use(cors({
  origin: env.CLIENT_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authorization headers
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();
 

app.listen(env?.PORT,() => {
  return console.log(`Express is listening at http://localhost:${env?.PORT}`);
});
   