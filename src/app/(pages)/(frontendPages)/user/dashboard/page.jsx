"use client";
import DashboardLayout from "@/components/server/user/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/auth/authContext";
useAuth;
const DashboardPage = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl py-5">
          Welcome <span className="text-red-400">{user?.firstname}!</span>
        </h1>
      </div>
      <div className="flex justify-between text-xl pt-11 items-center">
        <p className="px-10">Your Courses</p>
        <p className="px-10">Order History</p>
        <p>
          <form className="max-w-md mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-[20rem] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-400 focus:border-red-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-400"
                placeholder="Search "
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-primarygold hover:bg-goldlight hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        </p>
      </div>
      <hr />
      <div className="px-11 py-5">No courses available</div>
    </DashboardLayout>
  );
};

export default DashboardPage;
