import express from "express";
import path from "path";
import logger from "morgan";
import locationsRouter from "./routes/locations";
import inspectionsRouter from "./routes/inspections";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/locations", locationsRouter);
app.use("/inspections", inspectionsRouter);

export default app;
