"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

const parseDateTime = (dateTime) => {
  const datePattern = /(\d{2}\/\d{2}\/\d{4})\s+\((\w+)\)\s+(\d{2}:\d{2}:\d{2})\s+-\s+(\d{2}:\d{2}:\d{2})/;
  const match = datePattern.exec(dateTime);
  if (match) {
    return {
      start_time: `${match[1]} ${match[3]}`, // Combine the date and start time
      end_time: `${match[1]} ${match[4]}`,   // Combine the date and end time
    };
  }
  return { start_time: "", end_time: "" };
};

const fetchEnrollmentData = async () => {
  try {
    const response = await axios.get(`/apiRoutes/coursedetails`);
    const enrollmentData = response.data.enrollmentData;

    // Parse date_time into start_time and end_time
    return enrollmentData.map((item) => {
      const { start_time, end_time } = parseDateTime(item.date_time);
      return {
        ...item,
        start_time,
        end_time,
      };
    });
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return [];
  }
};

const ScheduleUI = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(currentDate.date());
  const [scheduleItems, setScheduleItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchEnrollmentData();
      setScheduleItems(data);
    };
    getData();
  }, []);

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

  // Filter schedule items for the selected date
  const filteredItems = scheduleItems.filter((item) =>
    dayjs(item.start_time).isSame(
      dayjs(`${currentDate.year()}-${currentDate.month() + 1}-${selectedDate}`),
      "day"
    )
  );

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
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 mb-4"
            >
              <div className="text-sm mb-2">
                Start: {item.start_time} <br />
                End: {item.end_time}
              </div>
              <h4 className="text-lg font-bold mb-2">{item.course_title}</h4>
              <div className="text-sm">
                <span className="font-semibold">Location:</span> {item.location}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Instructor:</span>{" "}
                {item.instructor_first_name} {item.instructor_last_name}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Price:</span> ${item.course_price}
              </div>
              {item.registration_closed && (
                <div className="text-red-500 mt-2">
                  You cannot register for this class anymore.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-red-500">
            No slots available for this day.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleUI;
