const express=require('express');
const app=express();
const dotenv=require('dotenv').config();
const port=process.env.PORT||7000;
const cors=require('cors');
const connectDB=require('./config/Db');
const router=require('./router/router');
const bodyparser=require('body-parser');

app.use(cors({
    origin:'*',
    credentials:true
}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use('/',router);

//db
connectDB();

app.get('/',(req,res)=>{
    res.send('API is running...');
});

app.listen(port,()=>{

    console.log(`Server is running on port http://localhost:${port}`);
});
