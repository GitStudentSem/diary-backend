import TasksModel from "../models/Tasks.js";

export const getAll = async (req, res) => {
  try {
    const tasks = await TasksModel.find({ user: req.userId });
    //   .populate("user")
    //   .exec();
    // // const tasks = await TasksModel.find().populate("user").exec();
    // console.log("tasks", tasks);

    res.json(tasks);
  } catch (error) {
    console.log("getAll()", error);
    res.status(500).json({ message: "Не удалось получить задачи" });
  }
};

export const removeTask = async (req, res) => {
  try {
    TasksModel.updateOne(
      {
        calendarDate: req.body.date,
      },
      { $pull: { tasks: { text: req.body.text } } },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить статью",
          });
        }

        if (!doc) {
          console.log(err);
          return res.status(404).json({
            message: "Не удалось найти статью",
          });
        }

        return res.json({ success: true });
      }
    );
  } catch (error) {
    console.log("remove()", error);
    res.status(500).json({ message: "Не удалось удалить задачу" });
  }
};
export const updateIsImportant = async (req, res) => {
  // console.log("ID", req.body._id);
  try {
    TasksModel.updateOne(
      {
        tasks: { $elemMatch: { text: req.body.text } },
        // tasks: { $elemMatch: { _id: req.body._id } },
      },
      { $set: { "tasks.$.isImportant": req.body.isImportant } },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось обновить важность задачи",
          });
        }

        if (!doc) {
          console.log(err);
          return res.status(404).json({
            message: "Не удалось найти задачу",
          });
        }

        return res.json({ success: true });
      }
    );
  } catch (error) {
    console.log("remove()", error);
    res.status(500).json({ message: "Не удалось удалить задачу" });
  }
};

export const addTask = async (req, res) => {
  try {
    const isHaveTask = await TasksModel.findOne({
      calendarDate: req.body.date,
      user: req.userId,
    });
    console.log(isHaveTask);
    if (!isHaveTask) {
      const doc = new TasksModel({
        calendarDate: req.body.date,
        tasks: [
          {
            text: req.body.text,
            isImportant: req.body.isImportant,
            user: req.userId,
          },
        ],
        user: req.userId,
      });

      const task = await doc.save();
      res.json(task);
    } else {
      await TasksModel.updateOne(
        { calendarDate: req.body.date, user: req.userId },
        {
          $addToSet: {
            tasks: {
              text: req.body.text,
              isImportant: req.body.isImportant,
              user: req.userId,
            },
          },
        }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.log("create()", error);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};

// export const update = async (req, res) => {
//   try {
//     const taskId = req.params.id;

//     await TasksModel.updateOne(
//       { _id: taskId },
//       {
//         $addToSet: {
//           tasks: { text: req.body.text, isImportant: req.body.isImportant },
//         },
//       }
//     );
//     res.json({ success: true });
//   } catch (error) {
//     console.log("update()", error);
//     res.status(500).json({ message: "Не удалось обновить статью" });
//   }
// };
