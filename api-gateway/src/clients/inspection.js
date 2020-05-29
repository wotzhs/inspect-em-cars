import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../../grpc-common-config";

const inspectionProtoDefitions = loadSync("inspection/inspection.proto", commonGrpcConfig);
const { inspection: { InspectionService }, google }  = grpc.loadPackageDefinition(inspectionProtoDefitions);

const GRPC_SERVER_IP = process.env.GRPC_SERVER_IP || "0.0.0.0";
const INSPECTION_PORT = process.env.INSPECTION_PORT || "50052";

const inspectionService = new InspectionService(`${GRPC_SERVER_IP}:${INSPECTION_PORT}`, grpc.credentials.createInsecure());

export default inspectionService;