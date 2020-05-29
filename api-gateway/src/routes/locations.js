import express from "express";
import locationService from "../clients/location";

const router = express.Router();

router.get("/", (req, res, next) => {
	locationService.getLocations({}, (err, resp)=> {
		res.json(resp);
	});
});

export default router;
