import React, { useContext, useEffect } from "react";
import { Task } from "../../components";
import { store } from "../../store";

import styles from "./Home.module.css";

const Home = () => {
  const { dispatch, state } = useContext(store);
  const isListEmpty = state.tasks.length === 0;

  useEffect(() => {
    dispatch({ type: "fetchTasks" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function insert() {
    dispatch({
      type: "insertTask",
      index: state.tasks.length - 1,
    });
  }

  return (
    <div className={styles.home}>
      <h1>Test TaskList</h1>
      <div>
        {state.tasks.map((taskProps) => (
          <Task key={taskProps.id} {...taskProps} />
        ))}
        <button className={styles.addButton} onClick={insert}>
          <span>+</span>
          {isListEmpty && <small>click to add first item</small>}
        </button>
      </div>
    </div>
  );
};
export default Home;
