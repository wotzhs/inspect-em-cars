import { connect } from "nats";

const natsServerUrl = process.env.NATS_SERVER_URL;

const nc = connect(natsServerUrl, { json: true });

export default nc;