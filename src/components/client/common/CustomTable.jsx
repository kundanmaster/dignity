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
  console.log("Search Input:", searchInput);

  const getFilteredData = (arr, searchInput) => {
    if (!arr || !Array.isArray(arr)) {
      console.error("Invalid data array");
      return [];
    }

    const searchStr = searchInput ? searchInput.toLowerCase() : "";
    console.log("Filtering with search input:", searchStr);

    return arr.filter((value) => {
      if (!value) return false;

      const name = value.name ? value.name.toLowerCase() : "";
      const days = value.days ? value.days.toString() : "";
      const items = value.items ? value.items : [];

      const nameMatches = name.includes(searchStr);
      const daysMatches = days.includes(searchStr);
      const oneItemMatches = items.some((item) =>
        item.toLowerCase().includes(searchStr)
      );

      return nameMatches || daysMatches || oneItemMatches;
    });
  };

  const filteredData = getFilteredData(data, searchInput);

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
      {/* Filters */}
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

      {/* Table */}
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
                    className="text-goldlight hover:text-amber-200 border-2 border-amber-400 p-2 rounded-xl"
                  >
                    <PiDotsThreeOutlineVerticalDuotone />
                  </button>

                  {openDropdownId === item.id && (
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
                                console.log(`Item clicked: ${menuItem.label} for ID: ${item.id}`);
                                menuItem.onClick(item.id)();
                              }}
                              className="block w-52 text-left px-4 py-2 m-2 rounded text-sm text-gray-700 hover:bg-amber-100"
                              role="menuitem"
                            >
                              {menuItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
