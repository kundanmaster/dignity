import React from "react";
import styles from "../../../../public/styles/authLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-b from-[#1d35636c] to-[#f27c2169]">
      <div className="m-auto bg-white w-full max-w-8xl h-[100%] grid lg:grid-cols-2">
        {/* Add overflow-hidden to the div containing the image */}
        <div className={`hidden lg:block overflow-hidden ${styles.imgStyle}`}>
          <div className={styles.mainImg}></div>
        </div>
        <div className="right flex flex-col justify-evenly lg:p-10">
          <div className="text-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
