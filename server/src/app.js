import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import caseRoutes from './routes/cases.js';

const app=express();
app.use(helmet());
const configuredOrigins=(process.env.CLIENT_ORIGIN||'http://localhost:5173').split(',').map(x=>x.trim()).filter(Boolean);
const developmentOrigins=process.env.NODE_ENV==='production'?[]:['http://localhost:5173','http://localhost:5174'];
const allowedOrigins=new Set([...configuredOrigins,...developmentOrigins]);
app.use(cors({origin(origin,cb){if(!origin||allowedOrigins.has(origin))return cb(null,true);cb(new Error('Origin not allowed'));},credentials:true}));
app.use(express.json({limit:'64kb'}));
app.get('/api/v1/health',(req,res)=>res.json({success:true,data:{status:'ok',database:'connected'},error:null}));
app.use('/api/v1/cases',rateLimit({windowMs:60_000,limit:20,standardHeaders:'draft-8',legacyHeaders:false}),caseRoutes);
app.use((req,res)=>res.status(404).json({success:false,data:null,error:{code:'NOT_FOUND',message:'The requested resource was not found.'}}));
app.use((err,req,res,next)=>{console.error(JSON.stringify({requestId:req.get('x-request-id')||null,operation:req.method+' '+req.path,errorType:err.name||'Error',errorCode:err.code||null,status:err.status||500}));const codes={429:'RATE_LIMITED',502:'GENERATION_FAILED',503:'SERVICE_UNAVAILABLE',504:'GENERATION_TIMEOUT'};res.status(err.status||500).json({success:false,data:null,error:{code:codes[err.status]||'INTERNAL_ERROR',message:err.status?err.message:'Something went wrong. Please try again.'}});});
export default app;
