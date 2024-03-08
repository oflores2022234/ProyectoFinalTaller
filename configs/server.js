'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import User from '../src/users/user.model.js'
import bcryptjs from 'bcryptjs'
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoriaRoutes from '../src/categorias/categorias.routes.js';
import productoRoutes from '../src/productos/productos.routes.js';
import carritoRoutes from '../src/carrito/carrito.routes.js';


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/shop/v1/auth'
        this.usuarioPath = '/shop/v1/users'
        this.categoriaPath = '/shop/v1/categoria'
        this.productoPath = '/shop/v1/producto'
        this.carritoPath = '/shop/v1/carrito'

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
        const lengthUsers = await User.countDocuments();
        if(lengthUsers > 0) return;

        const salt = bcryptjs.genSaltSync();
        const password = bcryptjs.hashSync('123456', salt);

        const adminUser = new User(
            {nombre: "User Admin", correo: "admin@kinal.edu.gt", password, role: "ADMIN_ROLE"}
        )

        adminUser.save();
    }
    

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.categoriaPath, categoriaRoutes);
        this.app.use(this.productoPath, productoRoutes)
        this.app.use(this.carritoPath, carritoRoutes)
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;