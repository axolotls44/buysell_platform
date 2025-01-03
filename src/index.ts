import createError from 'http-errors'
import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
// import cluster from 'cluster'
import os from 'os'
import cookieParser from 'cookie-parser'
import morganMiddleware from './config/morganMiddleware'
import dotenv from 'dotenv'
import Logger from './lib/logger'
import cors from 'cors'
import helmet from 'helmet'

dotenv.config()
var port: unknown = process.env.PORT || 3000
const numCPUs = os.cpus().length
const indexRouter = require('./routes/index');
const app: Application = express()
// if (cluster.isPrimary) {
//     Logger.warn(`Master process ${process.pid} is running`)

//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork()
//     }

//     cluster.on('exit', (worker) => {
//         Logger.debug(`Worker process ${worker.process.pid} died. Restarting...`)
//         cluster.fork()
//     })
// } else {


    app.use(morganMiddleware)
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/', indexRouter);

    // catch 404 and forward to error handler
    app.use(function (req: Request, res: Response, next: NextFunction) {
        next(createError(404))
    })

    // catch 404 and forward to error handler
    app.get('/', (req: Request, res: Response) => {
        res.send('hello world')
    })
    // error handler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.use(function (err: any, req: Request, res: Response) {
        // set locals, only providing error in development
        res.locals.message = err.message
        res.locals.error = req.app.get('env') === 'development' ? err : {}
        res.status(err.status || 500).send({
            data: {},
            message: err.message,
            status: false,
        })
    })

    app.listen(port, () => {
        Logger.debug(
            `Worker process  is listening on port ${port}`
        )
    })

// }
export default app


