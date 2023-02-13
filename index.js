import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  taskCreateValidation,
} from "./validation.js";
import checkAuth from "./utils/checkAuth.js";
import { handleValidationErrors } from "./utils/handleValidationErrors.js";
import { UserController, TaskController } from "./controllers/index.js";

dotenv.config();
mongoose
  .connect(
    `mongodb+srv://db${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xv78ayw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/tasks", checkAuth, TaskController.getAll);
app.post(
  "/tasks",
  checkAuth,
  taskCreateValidation,
  handleValidationErrors,
  TaskController.addTask
);
app.patch("/tasks/delete", checkAuth, TaskController.removeTask);
app.patch("/tasks/isImportant", checkAuth, TaskController.updateIsImportant);
// app.patch(
//   "/tasks/:id", //:id
//   checkAuth,
//   taskCreateValidation,
//   handleValidationErrors,
//   TaskController.update
// );

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
