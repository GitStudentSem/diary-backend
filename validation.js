import { body } from "express-validator";

export const loginValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укажите имя").isLength({ min: 2 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const taskCreateValidation = [
  body("text", "Введите текст статьи")
    .isLength({
      min: 3,
    })
    .isString(),
  // body("isImportant", "важность задачи").isBoolean(),
  // body("tags", "Неверный формат тегов (укажите массив)").optional().isString(),
  // body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
