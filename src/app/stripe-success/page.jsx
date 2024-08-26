"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SuccessPayment = ({searchParams: {amount}}) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState({});
  useEffect(() => {
    // Wait for router to be ready before accessing query
    if (router.isReady) {
      const {  session_id, course_title, user_name } = router.query;
      console.log( session_id, course_title, user_name);
      
      setQueryParams({  session_id, course_title, user_name });
    }
  }, [router.isReady, router.query]);

  // Destructure with default values to prevent undefined error
  const {
    session_id = "",
    course_title = "",
    user_name = "",
  } = queryParams;

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Thank you, {user_name || "Customer"}!
        </h1>
        <h2 className="text-2xl">
          You successfully enrolled in {course_title || "the course"}.
        </h2>
        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount || "0"}.00
        </div>
        <p className="mt-4 text-lg">
          Your payment session ID: {session_id || "N/A"}
        </p>
      </div>
      <Link href="/user/courses" passHref>
        <button className="text-purple-500 bg-white rounded-md hover:bg-slate-300 p-4">
          Go to My Course{" "}
        </button>
      </Link>
    </main>
  );
};

export default SuccessPayment;
