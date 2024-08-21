"use client";
import { useState } from "react";
import dayjs from "dayjs";

const ScheduleUI = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(currentDate.date());

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
    setSelectedDate(1);
  };
  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
    setSelectedDate(1);
  };
  const scheduleItems = [
    {
      start: "9:00 AM",
      end: "11:00 AM",
      title: "CPR",
      location: "Central Phoenix Training Center",
      instructor: "Josh Walker",
      seats: 2,
      price: "$30.00",
      registrationClosed: true,
    },
    {
      start: "9:00 AM",
      end: "3:00 PM",
      title: "Espanol DCW Fundamentals",
      location: "Bell Road Training Center",
      instructor: "Cintya Arcos",
      seats: 7,
      price: "$150.00",
      registrationClosed: true,
    },
    {
      start: "11:00 AM",
      end: "1:00 PM",
      title: "First Aid",
      location: "Central Phoenix Training Center",
      instructor: "Josh Walker",
      seats: 1,
      price: "$30.00",
      registrationClosed: true,
    },
  ];

  const getDayClass = (day) => {
    if (
      day === selectedDate &&
      currentDate.month() === dayjs().month() &&
      currentDate.year() === dayjs().year()
    ) {
      return "bg-gray-300";
    }
    return "hover:bg-gray-200";
  };

  return (
    <div className="flex bg-white">
      {/* Calendar Section */}
      <div className="w-1/3 p-4">
        <div className="text-center">
          {/* Navigation buttons and current month/year display */}
          <div className="flex justify-between mb-4">
            <button className="p-2" onClick={handlePrevMonth}>
              &lt;
            </button>
            <h2 className="font-bold text-lg">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <button className="p-2" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>
          {/* Calendar grid layout */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day labels */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-semibold">
                {day}
              </div>
            ))}
            {/* Empty spaces for days before the 1st */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`p-2 cursor-pointer rounded-full ${getDayClass(
                  day
                )}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex flex-col items-center">
                  <span>{day}</span>
                  <span className="text-red-500">&#8226;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="w-2/3 p-4">
        <h3 className="text-lg font-semibold mb-4">
          {currentDate.format("MMMM")} {selectedDate}, {currentDate.year()}
        </h3>
        {scheduleItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 mb-4"
          >
            <div className="text-sm mb-2">
              Start: {item.start} <br />
              End: {item.end}
            </div>
            <h4 className="text-lg font-bold mb-2">{item.title}</h4>
            <div className="text-sm">
              <span className="font-semibold">Location:</span> {item.location}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Instructor:</span>{" "}
              {item.instructor}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Available Seats:</span>{" "}
              {item.seats}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Price:</span> {item.price}
            </div>
            {item.registrationClosed && (
              <div className="text-red-500 mt-2">
                You cannot register for this class anymore.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleUI;
