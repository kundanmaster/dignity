import React from "react";
import styles from "../../../../public/styles/authLayout.module.css";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-b from-amber-100">
      <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2 shadow-md">
        <div className={styles.imgStyle}>
          <div className={styles.mainImg}></div>
        </div>
        <div className="right flex flex-col justify-evenly ">
          <div className="text-center py-10 ">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
