import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaCamera } from "react-icons/fa";
import Image from "next/image";

export default function ThumbnailCarousel({ value, onChange, defaultValue }) {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");

  useEffect(() => {
    if (defaultValue) {
      setImageUrl(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      onChange({ target: { id: "thumbnail", value: newImageUrl } });
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value.trim();
    setImageUrl(url);
    onChange({ target: { id: "thumbnail", value: url } });
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
        <Carousel showThumbs={false}>
          {imageUrl ? (
            <div>
              <Image
                width={300}
                height={200}
                src={imageUrl}
                alt="Uploaded Image"
                className="object-cover w-full h-60"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 bg-gray-100 text-gray-500">
              <FaCamera size={50} />
              <p className="mt-2">No image uploaded</p>
            </div>
          )}
        </Carousel>
        <div className="mt-4 flex items-center">
          <input
            id="image"
            type="url"
            placeholder="Paste image URL or upload link"
            value={imageUrl}
            onChange={handleUrlChange}
            className="p-2 border border-gray-300 rounded-l-md w-full"
          />
          <label className="cursor-pointer bg-blue-500 text-white text-sm text-nowrap px-8 py-3 rounded-r-md">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
