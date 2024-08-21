import { useState, useEffect, useRef } from 'react';

export default function SearchableSelect({ options, onSelect, defaultValue }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue || null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && filteredOptions.length > 0) {
      handleSelect(filteredOptions[0]);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="text-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : 'Select a category'}
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full border border-gray-300 bg-white rounded-md shadow-lg z-10">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            name={searchTerm}
            ref={inputRef}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value} // Ensure value is unique
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
