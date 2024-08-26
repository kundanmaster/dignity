import React, { useState } from "react";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";

const CustomTable = ({
  data,
  headers,
  filters,
  handleFilterChange,
  handleSearchChange,
  filterOptions,
  items = [],
}) => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const searchInput =
    filters.find((filter) => filter.key === "search")?.value || "";

  const getFilteredData = (arr, searchInput, filters) => {
    if (!arr || !Array.isArray(arr)) {
      console.error("Invalid data array");
      return [];
    }

    const searchStr = searchInput.toLowerCase();
    const selectedCategory = filters.find(
      (filter) => filter.key === "category"
    )?.value;
    const selectedLevel = filters.find(
      (filter) => filter.key === "level"
    )?.value;

    return arr.filter((item) => {
      if (!item) return false;

      const idMatches = item.id
        ? item.id.toString().includes(searchStr)
        : false;
      const firstnameMatches = item.firstname
        ? item.firstname.toLowerCase().includes(searchStr)
        : false;
      const lastnameMatches = item.lastname
        ? item.lastname.toLowerCase().includes(searchStr)
        : false;
      const emailMatches = item.email
        ? item.email.toLowerCase().includes(searchStr)
        : false;

      const categoryMatches = selectedCategory
        ? item.category === selectedCategory
        : true;
      const levelMatches = selectedLevel ? item.level === selectedLevel : true;

      return (
        (idMatches || firstnameMatches || lastnameMatches || emailMatches) &&
        categoryMatches &&
        levelMatches
      );
    });
  };

  const filteredData = getFilteredData(data, searchInput, filters);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleMenu = (itemId) => {
    setOpenDropdownId(openDropdownId === itemId ? null : itemId);
  };

  return (
    <div className="shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 px-4 py-2">
        {filters.map((filter, index) => (
          <div key={index}>
            <label
              htmlFor={`${filter.key}Filter`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {filter.label}:
            </label>
            {filter.type === "select" ? (
              <select
                id={`${filter.key}Filter`}
                value={filter.value}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                {filterOptions[filter.key].map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type}
                id={`${filter.key}Filter`}
                value={filter.value}
                onChange={handleFilterChange}
                placeholder={filter.placeholder}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header.label}
              </th>
            ))}
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {visibleData.map((item) => (
            <tr
              key={item.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {headers.map((header, index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap">
                  {header.key === "section" ? (
                    <>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        T-Section: {item.section}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        T-Lesson: {item.lesson}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item[header.key]}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 justify-center text-center items-center whitespace-nowrap text-sm font-medium">
                <div className="relative inline-block">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents click from bubbling up
                      toggleMenu(item.id);
                    }}
                    className="text-goldlight border-2 border-goldlight hover:text-primarygold p-2 rounded-xl"
                  >
                    <PiDotsThreeOutlineVerticalDuotone />
                  </button>

                  {openDropdownId === item.id && (
                    <div className="bg-slate-300 w-full h-full">
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        onClick={(e) => e.stopPropagation()} // Prevents clicks from closing the menu
                      >
                        <ul
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {items.map((menuItem, index) => (
                            <li key={index}>
                              <button
                                onClick={() => {
                                  console.log(
                                    `Item clicked: ${menuItem.label} for ID: ${item.id}`
                                  );
                                  menuItem.onClick(item.id)();
                                }}
                                className="block w-52 text-left px-4 py-2 m-2 rounded text-sm text-gray-700 hover:bg-primarygold hover:text-white"
                                role="menuitem"
                              >
                                {menuItem.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:items-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + pageSize, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>

          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px ml-3"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-blue-50 dark:bg-gray-700 border-blue-500 text-blue-600 dark:text-gray-300"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
