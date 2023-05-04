import React from 'react';

import styles from './Login.module.scss';

export const Login = () => {
  return (
    <div className={styles.container}>
        <form>
          <label>Nickname</label>
          <input type="text" />
          <label>Password</label>
          <input type="password" />
          <button>Login</button>
        </form>
    </div>
  );
};
