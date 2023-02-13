import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    // Шифрование пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Создаем пользователя через mongodb
    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
    });

    // сохранение пользователя
    const user = await doc.save();

    // Создание токена
    const token = jwt.sign({ _id: user._id }, "somthingSecretWord", {
      expiresIn: "30d",
    });
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "UserController:34 Не удалось зарегестрироваться" });
  }
};

export const login = async (req, res) => {
  try {
    // проверка на наличие почты
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "UserController:46 Пользователь не найден" });
    }

    // Проверка на правильность пароля
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res
        .status(400)
        .json({ message: "UserController:58 Не верный логин или пароль" });
    }

    // Создание токена
    const token = jwt.sign({ _id: user._id }, "somthingSecretWord", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "UserController:73 Не удалось авторизоваться" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    userDatas = user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "UserController:84 Пользователь не найден" });
    }
    const { passwordHash, ...userData } = user._doc;
    console.log("user:", userData);
    res.json({ userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "UserController:91 Нет доступа" });
  }
};

export let userDatas = {};
