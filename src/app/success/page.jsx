"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const SuccessPage = () => {
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const enrollment = sessionStorage.getItem("enrollmentData");
    const order = sessionStorage.getItem("orderID");

    if (enrollment) {
      setEnrollmentData(JSON.parse(enrollment));
    } else {
      toast.error("No enrollment data found.");
      router.push("/enroll");
    }

    if (order) {
      setOrderID(order);
    } else {
      toast.error("No PayPal order ID found.");
      router.push("/enroll");
    }
  }, [router]);

  if (!enrollmentData || !orderID) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase. Your enrollment is complete.
        </p>
        <div className="text-left">
          <h2 className="text-2xl font-semibold mb-4">Enrollment Details:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Course Title:</strong> {enrollmentData.courseTitle}</li>
            <li><strong>Date & Time:</strong> {enrollmentData.date_time}</li>
            <li><strong>Location:</strong> {enrollmentData.location}</li>
            <li><strong>Phone Number:</strong> {enrollmentData.phoneNumber}</li>
            <li><strong>Address:</strong> {enrollmentData.address}</li>
            <li><strong>Additional Info:</strong> {enrollmentData.additionalInfo}</li>
            <li><strong>Order ID:</strong> {orderID}</li>
          </ul>
        </div>
        <Link href="/user/courses" passHref>
            <p className="text-blue-500 hover:underline pt-4">Go to My Course </p>
          </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
