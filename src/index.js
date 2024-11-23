import app from './app.js'
import dotenv from 'dotenv'
import {sequelize} from './config/db.js'

dotenv.config()

const port = process.env.PORT || 4000;

async function main(){
    try {
        await sequelize.sync()
        app.listen(process.env.PORT)
        console.log(`App escuchando en el puerto: ${port}`)
    } catch (error) {
        console.error('no se conecto la bd')
    }
}

main()