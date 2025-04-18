
 const env  = {
    get PORT(){
        return process.env.PORT as string;
    },
    get MONGO_URL(){
        return process.env.MONGO_URL as string;
    },
    get CLIENT_ORIGIN(){
        return process.env.CLIENT_ORIGIN as string;
    },
    get SERVER_URL(){
        return process.env.SERVER_URL as string;
    },
    get  EMAIL(){
        return process.env?.USER_EMAIL
    },
    get PASSWORD(){
        return process.env?.USER_PASS
    }
}
export default env