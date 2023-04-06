import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';

const ImagePreview = ({pageType}) => {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const endpoint = pageType === 'attack' ? `http://127.0.0.1:8000/attack/status/${task_id}` : `http://127.0.0.1:8000/defense/status/${task_id}`;
  useEffect(() => {
    const dataUrl = localStorage.getItem('image');
    setImageDataUrl(dataUrl);
  }, []);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };
    reader.onload = async () => {
      const imageDataUrl = reader.result;
      setUploadedImage(imageDataUrl);
  
      const localStorageItem = localStorage.getItem('response');
      if (localStorageItem) {
        const task_id = JSON.parse(localStorageItem).task_id;
        const interval = setInterval(async () => {
          const taskResponse = await axios.get(endpoint);
          if (taskResponse && taskResponse.data && taskResponse.data.progress) {
            setProgress(taskResponse.data.progress);
          }
          if (taskResponse && taskResponse.data && taskResponse.data.state === 'SUCCESS') {
            clearInterval(interval);
          }
        }, 4000);
      } else {
        console.log('localStorage item not found');
      }
    };
  };
  

  return (
    <div className="row">
      <div className="col">
        <h2>Originial Image</h2>
        {imageDataUrl && <img src={imageDataUrl} alt="Local Storage Image Preview" className="img-fluid" />}
      </div>
      <div className="col">
        <ProgressBar/>
      </div>
      <div className="col">
        <h2>Modified Image</h2>
        
      </div>

    </div>
  );
};

export default ImagePreview;
