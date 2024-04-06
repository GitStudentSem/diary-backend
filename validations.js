import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];
export const registerValidation = [
  body("email", "Email должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const taskValidation = [
  body("answers", "Данные должны быть не пустым массивом").isArray({ min: 1 }),
  body("answers.*.*", "Ответ должен быть числом").isNumeric(),
];
