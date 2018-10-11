import {createServer} from "http";
import * as express from "express";
import * as bodyParser from "body-parser";

const debug = require("debug")("mnb:transform:server");

import {ServiceOptions} from "./options/serviceOptions";

import {graphQLMiddleware, graphiQLMiddleware} from "./graphql/middleware/graphQLMiddleware";
import {tracingQueryMiddleware} from "./rawquery/tracingQueryMiddleware";

const PORT = process.env.API_PORT || ServiceOptions.serverOptions.port;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());


app.use("/tracings", tracingQueryMiddleware);

app.use(ServiceOptions.serverOptions.graphQlEndpoint, graphQLMiddleware());

app.use(["/", ServiceOptions.serverOptions.graphiQlEndpoint], graphiQLMiddleware(ServiceOptions.serverOptions));

const server = createServer(app);

server.listen(PORT, () => {
    debug(`transform api server is now running with env ${ServiceOptions.envName} on http://localhost:${PORT}`);
});
