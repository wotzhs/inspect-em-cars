import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../grpc-common-config";
import Routes from "./routes";
import nc from "../clients/nats";
import NATSWorker from "./workers/nats";

const packageDef = loadSync("location/location.proto", commonGrpcConfig);
const { LocationService } = grpc.loadPackageDefinition(packageDef).location;

const server = new grpc.Server();

server.addService(LocationService.service, {
	getLocations: Routes.getLocations,
	getLocationAvailabilities: Routes.getLocationAvailabilities,
	updateLocationAvailabilities: Routes.updateLocationAvailabilities,
});

const natsWorker = new NATSWorker(nc);
natsWorker.init();

const SERVER_IP = process.env.SERVER_IP || "0.0.0.0";
const SERVER_PORT = process.env.SERVER_PORT || "50051";

server.bind(`${SERVER_IP}:${SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();