import { db } from "./index.js";

export const getUserFilePath = (email) => {
  const fileName = email.split("@")[0];
  const filePath = `./users/${fileName}`;
  return filePath;
};

export const sendError = ({
  status = 500,
  message = "Неизвестная ошибка",
  error,
  res,
}) => {
  console.log(message, error);
  return res.status(status).send({ message });
};

export const isUserExist = async (req, res) => {
  const userId = req.userId;
  const users = await db.getData("/users");
  const user = findUserById(users, userId);
  if (!user) {
    res.status(404).json({ message: "Пользователь не найден" });
    return false;
  }
  return user;
};

export const findUserById = (users, id) => {
  for (let key in users) {
    if (users[key]._id === id) {
      return users[key];
    }
  }
  return null;
};
