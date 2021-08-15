import React, { createContext, useReducer } from "react";
import { collection, storage } from "./utils";
const { nanoid } = require("nanoid");

const initialState = {
  tasks: [],
};
const store = createContext(initialState);
const { Provider } = store;

const sortData = (data) => {
  const tasks = data.filter((item) => !item.isSubTask);
  const subTasks = data.filter((item) => item.isSubTask);
  return tasks.map((task) => {
    const relatedSubTasks = subTasks.filter(
      (subTask) => task.id === subTask.parentId
    );
    return { ...task, subTasks: relatedSubTasks };
  });
};
const { getFullItem, insert, getPrevItem, moveItem, remove, update } =
  collection;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "fetchTasks": {
        const data = storage.load("tasks");
        const tasks = sortData(data);
        return { tasks, flatTasks: data };
      }

      case "insertTask": {
        const { id, index } = action;
        const taskList = state.flatTasks;
        const currentItem = getFullItem(taskList, { id });
        const currentItemIndex =
          index || taskList.findIndex((item) => item.id === id);

        const isSubTask = currentItem.isSubTask;

        const newFlatTaskList = insert(taskList, currentItemIndex, {
          id: nanoid(10),
          title: "",
          subTasks: [],
          isSubTask,
          shouldFocus: true,
          parentId: currentItem.parentId,
        });

        storage.save("tasks", newFlatTaskList);
        return { flatTasks: newFlatTaskList, tasks: sortData(newFlatTaskList) };
      }

      case "updateTask": {
        const { object } = action;

        const taskList = state.flatTasks;
        const newFlatTaskList = update(taskList, { ...object });
        storage.save("tasks", newFlatTaskList);
        return { flatTasks: newFlatTaskList, tasks: sortData(newFlatTaskList) };
      }

      case "removeTask": {
        const taskList = state.flatTasks;
        const newFlatTaskList = remove(taskList, action.object);
        const prevItem = getPrevItem(taskList, action.object);

        action.getPrevItem && action.getPrevItem(prevItem);
        storage.save("tasks", newFlatTaskList);
        return { tasks: sortData(newFlatTaskList), flatTasks: newFlatTaskList };
      }

      case "activeFocus": {
        const { object } = action;
        const taskList = state.flatTasks.map((item) => ({
          ...item,
          shouldFocus: false,
        }));

        const newTaskList = update(taskList, {
          ...object,
          shouldFocus: true,
        });

        storage.save("tasks", newTaskList);
        return { tasks: sortData(newTaskList), flatTasks: newTaskList };
      }

      case "convertToSubTask": {
        const { object } = action;
        const flatTaskList = state.flatTasks;
        const taskList = state.tasks;
        const prevItem = getPrevItem(taskList, action.object);

        let newTaskList = flatTaskList;
        if (prevItem) {
          const prevItemIndex = newTaskList.findIndex(
            (item) => item.id === prevItem.id
          );
          newTaskList = update(flatTaskList, {
            ...object,
            isSubTask: true,
            parentId: prevItem.id,
          });
          newTaskList = moveItem(
            newTaskList,
            object,
            prevItem.subTasks.length + prevItemIndex + 1
          );
        }

        storage.save("tasks", newTaskList);
        return { tasks: sortData(newTaskList), flatTasks: newTaskList };
      }

      case "convertToTask": {
        const { object } = action;
        const flatTaskList = state.flatTasks;
        const taskList = state.tasks;
        let newTaskList = flatTaskList;
        const parentItem = getFullItem(taskList, {
          id: object.parentId,
        });
        const parentIndex = taskList.findIndex(
          (item) => item.id === parentItem.id
        );

        newTaskList = update(flatTaskList, {
          ...object,
          isSubTask: false,
          parentId: parentItem.parentId,
        });
        newTaskList = moveItem(
          newTaskList,
          object,
          parentItem.subTasks.length + parentIndex
        );

        storage.save("tasks", newTaskList);
        return { tasks: sortData(newTaskList), flatTasks: newTaskList };
      }

      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
