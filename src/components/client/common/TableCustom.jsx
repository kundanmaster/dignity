import { CustomTable } from './CustomTable';

const TABLE_HEADERS = ["Transaction", "Amount", "Date", "Status", "Account"];
const TABLE_DATA = [
  // Your data here
];

export default function App() {
  const handleSearch = (term) => {
    // Implement search functionality if needed
  };

  const handleAction = (action, row) => {
    // Handle actions such as edit
    console.log(action, row);
  };

  return (
    <CustomTable
      headers={TABLE_HEADERS}
      rows={TABLE_DATA}
      onSearch={handleSearch}
      onAction={handleAction}
    />
  );
}
