const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.conectarDB();
    }

    async conectarDB(){
        await dbConnection();
    }

    listen(){
        this.app.listen(this.port, () =>{
            
            console.log('Servidor ejecutandose y escuchando el puerto', this.port)
        });
    }

}

module.exports = Server;