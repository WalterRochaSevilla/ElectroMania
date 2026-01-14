import { parse } from "path";

export default () => ({
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        type: process.env.DATABASE_TYPE,
        name: process.env.DATABASE_NAME,
        syncronize: process.env.DATABASE_STYNCHRONIZE
    },
    bcrypt:{
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
    },
    jwtConstants:{
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION
    },
    webSiteDomain: {
        url: process.env.WEBSITE_DOMAIN
    }
})