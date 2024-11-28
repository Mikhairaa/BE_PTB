const express = require('express')
const mysql = require('mysql2')
const usersRoutes = require('./routes/users.js')
const beritasRoutes = require('./routes/berita.js')
const app = express()
require('dotenv').config();
const sequelize = require('./models').sequelize;
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json())

app.use('/api/user',usersRoutes);
app.use('/api/berita',beritasRoutes);

app.listen(4000,()=>{
    console.log('Server running on port 4000')
})
