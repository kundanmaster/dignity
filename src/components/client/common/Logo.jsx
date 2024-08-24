import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div>
      <div className="text-2xl font-bold flex items-center text-goldlight">
        <Image
          src="/images/pages/mainlogoo.png"
          alt="alt"
          width={150}
          height={150}
        />
        <span className="hidden sm:inline text-center">
          DIGNITY MEDICAL TRAINING <br />
          <span className="text-lg">
            <span className="text-primarygold">Enriching Minds,</span> Building
            Careers
          </span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
