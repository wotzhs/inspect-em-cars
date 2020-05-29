import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../../grpc-common-config";

const inspectionProtoDefitions = loadSync("inspection/inspection.proto", commonGrpcConfig);
const { inspection: { InspectionService }, google }  = grpc.loadPackageDefinition(inspectionProtoDefitions);
const inspectionService = new InspectionService("0.0.0.0:50052", grpc.credentials.createInsecure());

export default inspectionService;