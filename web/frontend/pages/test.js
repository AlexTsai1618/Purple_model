import React, { useState, useEffect } from 'react';

const ImagePreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  useEffect(() => {
    const task_id = localStorage.getItem('task_id');
    if (task_id) {
      const intervalId = setInterval(async () => {
        const res = await fetch(`http://localhost:8000/task-status/${task_id}`);
        const data = await res.json();
        if (data.status === 'SUCCESS') {
          clearInterval(intervalId);
        } else {
          setProgress(data.progress);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div>
      {previewUrl && <img src={previewUrl} alt="Preview" />}
      {progress > 0 && progress < 100 && <div className="progress">
        <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{progress}%</div>
      </div>}
    </div>
  );
};

export default ImagePreview;
