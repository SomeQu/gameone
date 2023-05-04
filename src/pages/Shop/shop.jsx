import React from "react";

import styles from "./Shop.module.scss";
import characterImg from "../../assets/img/character.png";
import heartImg from "../../assets/img/heart.svg";
import coin from "../../assets/img/coin.png";

export const Shop = () => {
  return (
    <div className="bg">
      <div className={styles.wrapper}>
        <div className={styles.statBlock}>
          <img src={characterImg} alt="" className={styles.characterImg} />
          <h3 className={styles.nickname}>Corzent</h3>
          <div class={styles.stats}>
            <h2>Health</h2>
            <div class={styles.stat100}>
              <div class={styles.healthScale}></div>
            </div>
            <h2>Armor</h2>
            <div class={styles.stat100}>
              <div class={styles.armorScale}></div>
            </div>
            <h2>Magic</h2>
            <div class={styles.stat100}>
              <div class={styles.magicScale}></div>
            </div>
          </div>
        </div>

        <div className={styles.buyBlock}>
          <div className={styles.resources}>
            <div className={styles.coins}>
              <p>13 783</p>
            </div>
            <div className={styles.donate}>
              <button>Donate</button>
            </div>
          </div>

          <div className={styles.cards}>
            <div className={styles.card}>
              <img src={heartImg} alt="health" />
              <h5>Health</h5>
              <p>Quality that determines the maximum amount of damage</p>
              <div className={styles.price}>
                <img src={coin} alt="" />
                <span>500</span>
              </div>
            </div>
            <div className={styles.card}>
              <img src={heartImg} alt="health" />
              <h5>Health</h5>
              <p>Quality that determines the maximum amount of damage</p>
              <div className={styles.price}>
                <img src={coin} alt="" />
                <span>500</span>
              </div>
            </div>
            <div className={styles.card}>
              <img src={heartImg} alt="health" />
              <h5>Health</h5>
              <p>Quality that determines the maximum amount of damage</p>
              <div className={styles.price}>
                <img src={coin} alt="coin" />
                <span>500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
