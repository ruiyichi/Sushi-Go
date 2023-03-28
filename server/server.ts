import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import cors, { CorsOptions } from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;
import { logger } from "./middleware/logEvents";
import { errorHandler } from "./middleware/errorHandler";


app.use(logger);

const whitelist = ["http://localhost:3000"];
const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.all("*", (req, res) => {
	res.status(404);
	res.type("txt").send("404 Not Found");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));