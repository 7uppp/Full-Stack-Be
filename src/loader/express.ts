import express from 'express';
import cors from 'cors';
import {config} from "../app/config/app";
import apiV1 from "../app/routes/v1/api";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

app.use(`${config.api.prefix}/v1`,apiV1);
app.get('/',(req,res)=>{
    res.send('Hello Be!');
});

app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
}).on('error', (e:any) => {
    console.log('Error', e);
});
