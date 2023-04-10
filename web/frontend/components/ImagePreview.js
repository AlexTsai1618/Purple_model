import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';

const ImagePreview = ({pageType}) => {
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState(null);
  
  useEffect(() => {
    const localStorageItem = JSON.parse(localStorage.getItem('response'));
    const imageUploadUrl = localStorageItem.image_upload_url;
    setImageDataUrl(imageUploadUrl);
    const fetchTaskProgress = async () => {
      
      const response = JSON.parse(localStorage.getItem('response'));
      
      const endpoint = pageType === "attack" ?  `http://127.0.0.1:8000/attack/status/` :   `http://127.0.0.1:8000/defense/status/` ;
      
      try {
        const taskResponse = await axios.get(endpoint+response.task_id);
      
        if (taskResponse.data.status === 'SUCCESS') {
          setResultImage(taskResponse.data.image_result_url.result);
        } else {
          setTaskState(taskResponse.data.state);
          
          setProgress(taskResponse.data.progress);
        }
      } catch (error) {
        console.error(error);
        console.log(pageType)
      }
    };
    const interval = setInterval(fetchTaskProgress, 1000);

    return () => clearInterval(interval);    
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
        const endpoint = pageType === 'attack' ? `http://127.0.0.1:8000/attack/status/` : `http://127.0.0.1:8000/defense/status/`;
        const interval = setInterval(async () => {
          
          const taskResponse = await axios.get(endpoint+task_id);
          console.log(taskResponse)
          if (taskResponse && taskResponse.data ) {
            setProgress(taskResponse.data.progress);
          }
          if (taskResponse && taskResponse.data && taskResponse.data.success) {
            setResultImage(taskResponse.data.image_result_url); // update result image URL
            clearInterval(interval);
          }
        }, 1000);
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
        <h2>Modified Image</h2>
        {resultImage && <img src={resultImage} alt="Result Image Preview" className="img-fluid" />}
        {!resultImage && <p>Result image will appear here when processing is complete</p>}        
      </div>

    </div>
  );
};

export default ImagePreview;
