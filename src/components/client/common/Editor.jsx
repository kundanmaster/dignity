import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Editor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value); // Local state to manage editor value

  useEffect(() => {
    // Update local state when parent value changes
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (content, _, __, editor) => {
    // Update local state immediately
    setEditorValue(content);

    // Use a debounce function if necessary to delay onChange propagation
    onChange(content); // Propagate change to parent component
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'align',
    'color', 'background',
    'link', 'image', 'video'
  ];

  return (
    <div className="">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleEditorChange} // Use local handler to manage changes
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

export default Editor;
