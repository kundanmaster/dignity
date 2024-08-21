import { useState } from 'react';

const PhotoForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, such as uploading the image to a server
    console.log('File submitted:', selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md">
      <div>
        <label htmlFor="uploadImage" className="form-label">Upload Image</label>
        <input
          type="file"
          id="uploadImage"
          name="uploadImage"
          onChange={handleFileChange}
          className="form-input"
        />
        <p className="mt-2 text-sm text-gray-600">{selectedFile ? selectedFile.name : 'No file chosen'}</p>
      </div>
      <div>
        <button type="submit" className="btn-design-1">Upload Photo</button>
      </div>
    </form>
  );
};

export default PhotoForm;
