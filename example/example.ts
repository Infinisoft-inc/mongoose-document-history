import 'es6-shim';
import 'reflect-metadata';
import { getModelForClass, mongoose, prop, arrayProp } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import express from 'express';
import moment from 'moment';
import { modelOptions } from '@typegoose/typegoose/lib/modelOptions';
import { Severity } from '@typegoose/typegoose/lib/internal/constants';
import { registerPlugin } from '../dist';
import { History } from '../dist';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class TestModel extends History {
    @prop()
    name: string;
}

class NoHistoryModel {
    @prop()
    address: string;
}

export class Server {
    public app: express.Application;
    private readonly PORT = 3000;

    constructor() {
        this.app = express();
        this.initializeErrorHandlers();
        this.initializeMiddleWare();
        this.initializeDb();
        this.initializeRoutes();
        this.runServer();
    }

    private initializeErrorHandlers() {
        this.app.on('error', (error: any) => {
            console.error(moment().format(), 'ERROR', error);
        });
    }

    private initializeMiddleWare() {
        this.app.use(express.json());
        mongoose.plugin(registerPlugin);
    }

    private runServer() {
        this.app.listen(this.PORT, () => console.log(`http is started ${this.PORT}`));
    }

    private initializeDb() {
        mongoose.set('useCreateIndex', true);
        mongoose.connect('mongodb://localhost:27017/plugin', this.getDbOptions())
            .then(() => { console.log('MongoDB Connected'); });
    }

    private initializeRoutes() {
        // HISTORY MODELS ROUTES
        this.app.post('/', function (req, res, next) {
            res.send(`POST request to the homepage, Data = ${JSON.stringify(req.body)}`);
            let obj: TestModel = JSON.parse(JSON.stringify(req.body));
            obj.history = [
                {
                    user: 'Bobz',
                    reason: 'created',
                }
            ];
            let serviceTestModel: ModelType<TestModel> = getModelForClass(TestModel);
            serviceTestModel.create(obj)
                .then((data) => console.log(`Record created = ${JSON.stringify(obj)}`))
                .catch((err) => console.log(`Error = ${err}`));
            next();
        });

        this.app.put("/update/:Id", function (req, res, next) {
            let serviceTestModel: ModelType<TestModel> = getModelForClass(TestModel);
            console.log(`Updating record ${req.params.Id} with data ${JSON.stringify(req.body)}`);

            serviceTestModel.updateOne({ _id: req.params.Id }, req.body, {
                new: true,
                __history: true,
                __user: 'mouimet',
                __reason: 'update'
            }, function (errFind, updatedEmp) {
                if (errFind) {
                    res.sendStatus(500);
                    return next(errFind);
                }
                return res.json(updatedEmp);
            });
        });

        // NO HISTORY MODELS ROUTES
        this.app.post('/nohistory', function (req, res, next) {
            res.send(`NO HISTORY MODEL POST request address, Data = ${JSON.stringify(req.body)}`);
            let obj: NoHistoryModel = JSON.parse(JSON.stringify(req.body));
            let serviceNoHistoryModel: ModelType<NoHistoryModel> = getModelForClass(NoHistoryModel);
            serviceNoHistoryModel.create(obj)
                .then((data) => console.log(`Record created = ${JSON.stringify(obj)}`))
                .catch((err) => console.log(`Error = ${err}`));
            next();
        });

        this.app.put("/nohistory/update/:Id", function (req, res, next) {
            let serviceNoHistoryModel: ModelType<NoHistoryModel> = getModelForClass(NoHistoryModel);
            console.log(`Updating record ${req.params.Id} with data ${JSON.stringify(req.body)}`);

            serviceNoHistoryModel.updateOne({ _id: req.params.Id }, req.body, {
                new: true,
                //__history: true
            }, function (errFind, updatedEmp) {
                if (errFind) {
                    res.sendStatus(500);
                    return next(errFind);
                }
                return res.json(updatedEmp);
            });
        });
    }

    private getDbOptions(): any {
        return { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
    }
}

const server = new Server();
export default server.app;
