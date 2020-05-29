import grpc from "grpc";
import { loadSync } from "@grpc/proto-loader";
import commonGrpcConfig from "../../../grpc-common-config";

const locationProtoDefitions = loadSync("location/location.proto", commonGrpcConfig);
const { location: { LocationService }, google }  = grpc.loadPackageDefinition(locationProtoDefitions);
const locationService = new LocationService("0.0.0.0:50051", grpc.credentials.createInsecure());

export default locationService;