const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./db/config');


//crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//cors
app.use(cors());

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas: auth, crear, login, renew
app.use('/api/auth',require('./routes/auth'));
//Ruta event
app.use('/api/event',require('./routes/events'))

app.listen(process.env.PORT, () => {
    console.log(`servidor ${process.env.PORT}`)
});

console.log('Hello World');