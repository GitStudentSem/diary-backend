import { db } from "./index.js";

export const getUserFilePath = (email) => {
  return `./users/${email}`;
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
  for (const key in users) {
    if (users[key]._id === id) {
      return users[key];
    }
  }
  return null;
};

export const formatDateToString = (dateString) => {
  if (dateString === "other") return dateString;

  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
