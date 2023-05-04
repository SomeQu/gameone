import React from "react";
import styles from "./StartScreen.module.scss";
import { useNavigate } from "react-router-dom/dist";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.startScreen}>
        <h1 className={styles.title}>BLOOD and HONOR</h1>
        <button className={styles.startBtn} onClick={() => navigate("/reg")}>
          Start game
        </button>
      </div>
    </div>
  );
}

export default HomePage;
