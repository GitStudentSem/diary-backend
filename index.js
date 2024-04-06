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
app.use(cors());
app.use(express.json());
export const db = new JsonDB(new Config("myDataBase", true, true, "/"));

app.post(
  "/auth/register",
  registerValidation,
  handleValudationErrors,
  userController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValudationErrors,
  userController.login
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post(
  "/tasks/:ticket",
  checkAuth,
  taskValidation,
  handleValudationErrors,
  taskController.send
);

app.get("/tasks/", checkAuth, taskController.getAll);
app.get("/tasks/:ticket", checkAuth, taskController.getOne);
app.delete("/tasks/:ticket", checkAuth, taskController.removeOne);
app.delete("/tasks", checkAuth, taskController.remove);

app.listen(3333, (err) => {
  if (err) {
    return console.log("Ошибка запуска сервера", err);
  }
  console.log("Server OK");
});
