import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../../grpc-common-config";

const locationProtoDefitions = loadSync("location/location.proto", commonGrpcConfig);
const { location: { LocationService }, google }  = grpc.loadPackageDefinition(locationProtoDefitions);

const GRPC_SERVER_IP = process.env.GRPC_SERVER_IP || "0.0.0.0";
const LOCATION_PORT = process.env.LOCATION_PORT || "50051";

const locationService = new LocationService(`${GRPC_SERVER_IP}:${LOCATION_PORT}`, grpc.credentials.createInsecure());

export default locationService;