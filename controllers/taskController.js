import {
  formatDateToString,
  getUserFilePath,
  isUserExist,
  sendError,
} from "../assets.js";
import { db } from "../index.js";

export const add = async (req, res) => {
  try {
    const user = await isUserExist(req, res);
    if (!user) return;

    const filePath = getUserFilePath(user.email);
    const { text, isImportant, dateKey } = req.body;

    const path = `${filePath}/tasks/${dateKey}`;
    const id = `${dateKey}_${text}_${Math.random()}`;

    const isExistTasks = await db.exists(path);

    if (isExistTasks) {
      const tasksOnDay = await db.getData(path);

      await db.push(path, [...tasksOnDay, { text, isImportant, id, dateKey }]);
    } else {
      await db.push(path, [{ text, isImportant, id, dateKey }]);
    }

    res.json(await db.getData(path));
  } catch (error) {
    sendError({ message: "Не удалось добавить задачу", error, res });
  }
};

export const setImportant = async (req, res) => {
  try {
    const user = await isUserExist(req, res);
    if (!user) return;

    const filePath = getUserFilePath(user.email);
    const { isImportant, dateKey, id } = req.body;

    const path = `${filePath}/tasks/${dateKey}`;

    const isExistTasks = await db.exists(path);

    if (!isExistTasks) throw new Error();

    const tasksOnDay = await db.getData(path);
    const updatedTask = tasksOnDay.map((task) => {
      return task.id === id ? { ...task, isImportant } : task;
    });

    await db.push(path, updatedTask);
    res.json(await db.getData(path));
  } catch (error) {
    sendError({ message: "Не удалось обновить задачу", error, res });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const user = await isUserExist(req, res);
    if (!user) return;

    const filePath = getUserFilePath(user.email);
    const { dateKey, id } = req.body;

    const path = `${filePath}/tasks/${dateKey}`;

    const isExistTasks = await db.exists(path);

    if (!isExistTasks) throw new Error();

    const tasksOnDay = await db.getData(path);
    const updatedTask = tasksOnDay.filter((task) => task.id !== id);

    if (updatedTask.length === 0) {
      await db.delete(path);
      return res.json([]);
    }

    await db.push(path, updatedTask);
    res.json(await db.getData(path));
  } catch (error) {
    sendError({ message: "Не удалось удалить задачу", error, res });
  }
};

export const getAll = async (req, res) => {
  try {
    const user = await isUserExist(req, res);
    if (!user) return;

    const filePath = getUserFilePath(user.email);
    const path = `${filePath}/tasks/`;

    const isExistTasks = await db.exists(path);

    if (!isExistTasks) return res.json([]);

    const allTasks = await db.getData(path);
    const tasksToSend = [];
    for (const key in allTasks) {
      tasksToSend.push(...allTasks[key]);
    }
    res.json(tasksToSend);
  } catch (error) {
    sendError({ message: "Не удалось получить результаты", error, res });
  }
};
const a = {
  "24-3-7": [{ text: 123, isImportant: false, id: "12345" }],
  "24-3-8": [
    { text: "somtehing else", isImportant: false, id: "12346" },
    { text: "somtehing else 2", isImportant: true, id: "12347" },
  ],
};
//////////////////////////////
// export const send = async (req, res) => {
//   try {
//     const user = await isUserExist(req, res);
//     if (!user) return;

//     const filePath = getUserFilePath(user.email);
//     const ticketNumber = req.params.ticket;
//     await db.push(`${filePath}/tasks/${ticketNumber}`, req.body);

//     const answers = await db.getData(`${filePath}/tasks/${ticketNumber}`);
//     res.json(answers);
//   } catch (error) {
//     sendError({ message: "Не удалось отправить билет", error, res });
//   }
// };

// export const getOne = async (req, res) => {
//   try {
//     const user = await isUserExist(req, res);
//     if (!user) return;

//     const filePath = getUserFilePath(user.email);

//     const ticketNumber = req.params.ticket;
//     const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
//     if (!isExistTasks)
//       return res.status(404).json({ message: "Ответ не найден" });

//     const answers = await db.getData(`${filePath}/tasks/${ticketNumber}`);
//     res.json(answers);
//   } catch (error) {
//     sendError({ message: "Не удалось получить результаты", error, res });
//   }
// };
// export const getAll = async (req, res) => {
//   try {
//     const user = await isUserExist(req, res);
//     if (!user) return;

//     const filePath = getUserFilePath(user.email);

//     const isExistTasks = await db.exists(`${filePath}/tasks`);
//     if (!isExistTasks)
//       return res.status(404).json({ message: "Ответы не найдены" });

//     const answers = await db.getData(`${filePath}/tasks`);
//     res.json(answers);
//   } catch (error) {
//     sendError({ message: "Не удалось получить результаты", error, res });
//   }
// };

// export const removeOne = async (req, res) => {
//   try {
//     const user = await isUserExist(req, res);
//     if (!user) return;

//     const filePath = getUserFilePath(user.email);

//     const ticketNumber = req.params.ticket;

//     const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
//     if (!isExistTasks)
//       return res.status(404).json({ message: "Ответ не найден" });

//     await db.delete(`${filePath}/tasks/${ticketNumber}`);

//     res.status(200).json({ message: `Билет ${ticketNumber} удален` });
//   } catch (error) {
//     sendError({ message: "Не удалось удалить результаты", error, res });
//   }
// };
// export const remove = async (req, res) => {
//   try {
//     const user = await isUserExist(req, res);
//     if (!user) return;

//     const filePath = getUserFilePath(user.email);
//     await db.delete(`${filePath}/tasks`);

//     res.status(200).json({ message: "Все билеты удалены" });
//   } catch (error) {
//     sendError({ message: "Не удалось удалить результаты", error, res });
//   }
// };
