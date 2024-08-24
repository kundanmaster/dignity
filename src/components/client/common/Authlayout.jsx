import React from "react";
import styles from "../../../../public/styles/authLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-b from-amber-100">
      <div className="m-auto bg-slate-50 rounded-md w-full max-w-6xl h-full max-h-[90%] grid lg:grid-cols-2 shadow-md">
        <div className={`hidden lg:block ${styles.imgStyle}`}>
          <div className={styles.mainImg}></div>
        </div>
        <div className="right flex flex-col justify-evenly p-4 lg:p-10">
          <div className="text-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
