import express, {NextFunction, Response, Request} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import sanitizedConfig from "./configs";
import {statisticsRouter} from "./routes";

const app = express();

app.use(cors({
    origin: [sanitizedConfig.CLIENT_URL, sanitizedConfig.API_URL]
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8')
    res.setHeader('Access-Control-Allow-Credentials', "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

app.use(`/statistics_api/v1/stat`, statisticsRouter)
app.use('*', (req, res) => {
    res.status(404).json('Route not found');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    res
        ?.status(err?.status || 500)
        ?.send({
            error: err?.message || 'Unknown Error',
            code: err?.status || 500
        });
});
mongoose?.connect(sanitizedConfig.MONGO_URL).then(() => {
    console.log("|-------------------------------------------")
    console.log('| Connect: success')
    app.listen(+sanitizedConfig.STAT_PORT, sanitizedConfig.HOST, () => {
        console.log(`| Statistic server started on port http://localhost:${sanitizedConfig.STAT_PORT}`);
        console.log("|___________________________________________")
    });
}).catch(err => {
    console.log(err)
    console.log('Socket connect: error')
})