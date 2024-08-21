"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import styles from "../../../../../../../public/styles/authLayout.module.css";
import {
  FaCcMastercard,
  FaCcVisa,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { useAuth } from "@/hooks/auth/authContext";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
};

const getUser = async (id) => {
  try {
    const response = await fetch(`/apiRoutes/addcourse?id=${id}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
    return { error: "Error fetching course" };
  }
};

const getScheduleCourse = async (id) => {
  try {
    const response = await fetch(`/apiRoutes/schedule?id=${id}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { error: "Error fetching schedule" };
  }
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${formattedDate} (${dayOfWeek})`;
};

const validationSchema = Yup.object({
  date_time: Yup.string().required("Date & Time is required"),
  location: Yup.string().required("Location is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?1?\d{10}$/, "Valid phone number is required")
    .required("Phone number is required"),
  address: Yup.string(),
  additionalInfo: Yup.string(),
});

const EnrollPage = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) router.push("/signin");
    const fetchData = async () => {
      if (params.id) {
        setLoading(true);
        const data = await getUser(params.id);
        if (!data.error) {
          setCourseData(data);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, router, user]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (params.id) {
        const data = await getScheduleCourse(params.id);
        if (!data.error) {
          if (data.schedules.length === 0) {
            toast.error(
              "This course is not scheduled yet. Please contact Admin or Instructor."
            );
            setErrorMessage(
              "This course is not scheduled yet. Please contact Admin or Instructor."
            );
          } else {
            setScheduleData(data.schedules);
          }
        } else {
          toast.error("Error fetching schedule data.");
        }
      }
    };
    fetchSchedule();
  }, [params.id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setShowPayPal(true);
    setSubmitVisible(false);
    const enrollmentData = {
      user_id: user?.id,
      course_id: courseData?.courses[0]?.id,
      firstName: user?.firstname,
      lastName: user?.lastname,
      email: user?.email,
      phoneNumber: values.phoneNumber,
      address: values.address,
      additionalInfo: values.additionalInfo,
      date_time: values.date_time,
      location: values.location,
      courseTitle: courseData?.courses[0]?.course_title,
      course_price: parseFloat(courseData?.courses[0]?.course_price),
    };
    sessionStorage.setItem("enrollmentData", JSON.stringify(enrollmentData));
    setSubmitting(false);
  };

  const onApprove = async (data) => {
    try {
      const response = await fetch("/apiRoutes/paypalcaptureorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderID,
          enrollmentData: JSON.parse(sessionStorage.getItem("enrollmentData")),
        }),
      });

      const capture = await response.json();
      if (!response.ok)
        throw new Error(capture.error || "Error capturing order");

      toast.success("Payment successful!");
      sessionStorage.setItem("orderID", data.orderID);
      // sessionStorage.removeItem("enrollmentData");
      // sessionStorage.removeItem("orderID");
      router.push("/success");
    } catch (error) {
      console.error("Capture Order Error:", error);
      toast.error("Failed to capture PayPal payment.");
    }
  };

  return (
    <div className={styles.enrollImg}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white w-full max-w-5xl rounded shadow p-8">
          <div className="flex text-4xl">
            <Link href="/">
              <IoHome className="hover:text-primarygold" />
            </Link>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-goldlight">
              ENROLLMENT {id}
            </h1>
            <p className="text-xl">
              {courseData?.courses[0]?.short_description || ""}
            </p>
          </div>
          <div className="mb-6">
            <nav className="text-lg">
              <a href="/" className="font-bold">
                Home
              </a>{" "}
              &raquo; Enrollment
            </nav>
          </div>
          <div className="mb-6 border-b border-gray-300">
            <p className="text-lg">Enroll Now.</p>
          </div>

          <Formik
            initialValues={{
              date_time: "",
              location: "",
              phoneNumber: "",
              address: "",
              additionalInfo: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty, isSubmitting }) => (
              <Form>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-gray-700">Payment For</label>
                    <Field
                      type="text"
                      name="courseTitle"
                      value={courseData?.courses[0]?.course_title || ""}
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Course Title"
                      disabled
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700">Amount</label>
                    <Field
                      type="text"
                      name="course_price"
                      value={`$${
                        courseData?.courses[0]?.course_price || "0.00"
                      }`}
                      className="w-full mt-1 p-2 border rounded text-goldlight"
                      placeholder="Price"
                      disabled
                    />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded mb-6">
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Select Date & Time <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="date_time"
                      disabled={errorMessage}
                      className={`w-full mt-1 p-2 border rounded ${
                        errors.date_time && touched.date_time
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select Date & Time</option>
                      {scheduleData.map((schedule) => {
                        const formattedDate = formatDateTime(schedule.date);
                        const timeRange = `${schedule.time_from} - ${schedule.time_to}`;
                        return (
                          <option
                            key={schedule.id}
                            value={`${formattedDate} ${timeRange}`}
                          >
                            {formattedDate} / {timeRange}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="date_time"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Select Location <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="location"
                      disabled={errorMessage}
                      className={`w-full mt-1 p-2 border rounded ${
                        errors.location && touched.location
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select Location</option>
                      <option value="Arizona">Arizona</option>
                      {/* {courseData?.courses[0]?.locations.map((loc, index) => (
                        <option key={index} value={loc}>{loc}</option>
                      ))} */}
                    </Field>
                    <ErrorMessage
                      name="location"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="phoneNumber"
                      disabled={errorMessage}
                      className={`w-full mt-1 p-2 border rounded ${
                        errors.phoneNumber && touched.phoneNumber
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Phone Number"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <Field
                      as="textarea"
                      name="address"
                      disabled={errorMessage}
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Address"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Additional Information
                    </label>
                    <Field
                      as="textarea"
                      name="additionalInfo"
                      disabled={errorMessage}
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Additional Information"
                    />
                  </div>
                  <div className="flex mt-6 justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-goldlight">
                        Total:{" "}
                        {`$${courseData?.courses[0]?.course_price || "0.00"}`}
                      </span>
                    </div>
                    {submitVisible && (
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={`bg-goldlight text-white py-2 px-4 rounded hover:bg-primarygold ${
                      !isValid || !dirty || isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!isValid || !dirty || isSubmitting}
                  >
                    Submit
                  </button>
                </div>
              )}
                    {/* <div>
                      <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 px-4 rounded ${
                          !isValid || !dirty || isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={!isValid || !dirty || isSubmitting}
                      >
                        Submit
                      </button>
                    </div> */}
                  </div>
                </div>
                <div className="flex justify-center items-center mt-2">
                  {showPayPal && (
                    <div className="mt-6">
                      <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: courseData?.courses[0]?.course_price,
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={onApprove}
                          onError={(error) => {
                            console.error("PayPal Button Error:", error);
                            toast.error("Failed to complete PayPal payment.");
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
          <div className="text-center mt-6">
            <p className="text-red-500 text-xl">{errorMessage}</p>
            <p className="text-sm text-gray-500">Payment methods accepted:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <FaCcMastercard className="hover:text-goldlight" size={32} />
              <FaCcVisa className="hover:text-goldlight" size={32} />
              <FaCcAmex className="hover:text-goldlight" size={32} />
              <FaCcDiscover className="hover:text-goldlight" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollPage;


