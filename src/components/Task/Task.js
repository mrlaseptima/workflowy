import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { cursor, shortcut } from "../../utils";
import { store } from "./../../store.js";
import styles from "./Task.module.css";

const Task = ({
  id,
  title,
  parentId,
  subTasks = [],
  isSubTask,
  shouldFocus,
}) => {
  const { dispatch } = useContext(store);
  const editableArea = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      const { current: element } = editableArea;
      element.focus();
      cursor.setToEnd(element);
    }
  }, [shouldFocus]);

  function update(e) {
    dispatch({ type: "updateTask", object: { id, title: e.target.innerText } });
  }

  function handleFocus() {
    dispatch({
      type: "activeFocus",
      object: { id },
    });
  }

  function detectShortcuts(e) {
    const isEnter = shortcut.key(e.keyCode) === "ENTER";
    const isBackspace = shortcut.key(e.keyCode) === "BACKSPACE";
    const isTab = shortcut.key(e.keyCode) === "TAB";
    const isDelete = shortcut.key(e.keyCode) === "DELETE";
    const isShift = e.shiftKey;
    const isCtrl = e.ctrlKey;

    if (isEnter) {
      e.preventDefault();
      dispatch({ type: "insertTask", id });
    }

    if (
      (isBackspace && !e.target.innerText) ||
      (isCtrl && isShift && isDelete)
    ) {
      e.preventDefault();
      dispatch({
        type: "removeTask",
        object: { id },
        getPrevItem: (prevItem) => {
          dispatch({
            type: "activeFocus",
            object: prevItem,
          });
        },
      });
    }

    if (isTab) {
      e.preventDefault();
      if (!isSubTask) {
        update(e);
        dispatch({ type: "convertToSubTask", object: { id } });
      }
    }

    if (isTab && isShift) {
      e.preventDefault();
      if (isSubTask) {
        update(e);
        dispatch({ type: "convertToTask", object: { parentId, id } });
      }
    }
  }

  return (
    <div className={styles.task}>
      <div>
        <Link to={`/${id}`}>
          <svg viewBox="0 0 18 18" className={styles.circleIcon}>
            <circle cx="9" cy="9" r="3.5"></circle>
          </svg>
        </Link>
        <span
          className={styles.title}
          ref={editableArea}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onBlur={update}
          onKeyDown={detectShortcuts}
          onFocus={handleFocus}
        >
          {title}
        </span>
      </div>
      {subTasks.length > 0 && (
        <div className={styles.subTasks}>
          {subTasks.map((taskProps, idx) => (
            <Task key={taskProps.id} {...taskProps} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Task;
