import app from './app.js'
import dotenv from 'dotenv'
import {sequelize} from './config/db.js'

dotenv.config()

async function main(){
    try {
        await sequelize.sync()
        app.listen(process.env.PORT)
        console.log(`App escuchando en el puerto: ${process.env.PORT}`)
    } catch (error) {
        console.error('no se conecto la bd')
    }
}

main()