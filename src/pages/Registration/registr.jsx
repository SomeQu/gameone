import React from "react";

import styles from "./Registration.module.scss";
import { useNavigate } from "react-router-dom";

export const Registration = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <form>
        <label>Email</label>
        <input type="email" />
        <label>Nickname</label>
        <input type="text" />
        <label>Password</label>
        <input type="password" />
        <button onClick={() => navigate("/game")}>Sign up</button>
      </form>
    </div>
  );
};
