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
		if (
			origin &&
			(whitelist.includes(origin) || process.env.NODE_ENV === "development")
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(cors(corsOptions));

app.use(express.json());

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

app.options("/auth/me", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*"); // Можете указать конкретный источник вместо звездочки
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.sendStatus(200);
});
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
