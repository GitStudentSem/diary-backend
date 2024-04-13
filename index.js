import express from "express";
import cors from "cors";

import {
	loginValidation,
	registerValidation,
	taskValidation,
} from "./validations.js";

import { checkAuth, handleValudationErrors } from "./midlewares.js";

import { JsonDB, Config } from "node-json-db";
import * as userController from "./controllers/userController.js";
import * as taskController from "./controllers/taskController.js";

const app = express();
const whitelist = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"https://your-gh-pages-url",
];
const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:5173");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

export const db = new JsonDB(new Config("myDataBase", true, true, "/"));

app.post(
	"/auth/register",
	registerValidation,
	handleValudationErrors,
	userController.register,
);
app.post(
	"/auth/login",
	loginValidation,
	handleValudationErrors,
	userController.login,
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post("/tasks/add", checkAuth, taskController.add);
app.patch("/tasks/isImportant", checkAuth, taskController.setImportant);
app.patch("/tasks/delete", checkAuth, taskController.deleteTask);
app.get("/tasks/all", checkAuth, taskController.getAll);

app.get("/check", (req, res) => {
	res.json("Запрос прошел");
});

app.listen(3333, (err) => {
	if (err) {
		return console.log("Ошибка запуска сервера", err);
	}
	console.log("Server OK");
});
