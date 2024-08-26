import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div>
      <div className="text-2xl font-bold flex items-center text-goldlight">
        <Image
          src="/images/pages/lolo.png"
          alt="alt"
          width={80}
          height={80}
          className="pr-4"
        />
        <span className="hidden sm:inline text-center text-nowrap">
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
