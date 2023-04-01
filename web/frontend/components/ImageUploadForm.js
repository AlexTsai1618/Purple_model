import { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessMessage = () => (
  <div className="alert alert-success" role="alert">
    Your image was uploaded successfully!
  </div>
);

const ImageUploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://127.0.0.1:8000/upload-image', formData);
      setResponse(res.data);
      setMessage(null);
      localStorage.setItem('response', JSON.stringify(res.data));
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (response && response.success) {
      setFile(null); // Clear file input field
    }
  }, [response]);

  if (response && response.success) {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">Choose an image to upload:</label>
        <div className="input-group">
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit" className="btn btn-primary" id="basic-addon3">Upload</button>
        </div>
        <div className="form-text" id="basic-addon4">
          {message && <p>{message}</p>}
        </div>
      </div>
    </form>
  );
};

export default ImageUploadForm;
