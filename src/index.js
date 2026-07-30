const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const redisClient = require('./config/redis');
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const cors = require('cors')
const aiRouter = require("./routes/aiChatting");
const userMiddleware = require('./middleware/userMiddleware');

app.use(cors({
    origin: ['http://localhost:5173',
    'https://zeroone-frontend.onrender.com'],
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());
app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',userMiddleware,aiRouter)

const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

