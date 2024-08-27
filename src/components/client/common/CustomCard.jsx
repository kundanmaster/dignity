import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";
import { RiEdit2Fill } from "react-icons/ri";

const CustomCard = ({ label, custom_img, customers }) => {
  return (
    <div className="w-full max-w-[26rem]">
      <Card className="shadow-lg ">
        <CardHeader floated={false} color="blue-gray" className="relative h-[200px]">
          <Image
            src={custom_img}
            alt="alt"
            width={500}
            height={500}
            layout="intrinsic"
            style={{width: '1000px', height: 'auto'}}
            className="flex rounded-t-lg object-cover items-center"
          />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
        </CardHeader>
        <CardBody>
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="font-medium">
              {label}
            </Typography>
            
          </div>
          <div className="divide-y divide-gray-200 h-[40vh] overflow-x-scroll">
            {customers.map(({ name, email, icon, onEdit }, index) => (
              <div
                key={index}
                className="flex items-center justify-between pb-3 pt-3 last:pb-0"
              >
                <div className="flex items-center gap-x-3">
                  <div>{icon}</div>
                  <div>
                    <Typography color="blue-gray" variant="h6">
                      {name}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {email}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="text" size="sm" onClick={onEdit}>
                    <RiEdit2Fill />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomCard;
