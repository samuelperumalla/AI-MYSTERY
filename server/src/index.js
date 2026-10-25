import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port=Number(process.env.PORT||5000);
try { await connectDatabase(process.env.MONGODB_URI); app.listen(port,()=>console.info(`AI Mystery Room API listening on ${port}`)); }
catch(error){console.error('Server startup failed:',error.message);process.exit(1);}
