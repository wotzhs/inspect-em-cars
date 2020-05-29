import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../grpc-common-config";
import routes from "./routes";

const packageDef = loadSync("inspection/inspection.proto", commonGrpcConfig);
const { InspectionService } = grpc.loadPackageDefinition(packageDef).inspection;

const server = new grpc.Server();

server.addService(InspectionService.service, {
	getAvailabilities: routes.getAvailabilities,
});

const SERVER_IP = process.env.SERVER_IP || "0.0.0.0";
const SERVER_PORT = process.env.SERVER_PORT || "50052";

server.bind(`${SERVER_IP}:${SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
server.start();