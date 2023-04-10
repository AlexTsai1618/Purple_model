import { useState, useEffect } from 'react';
import axios from 'axios';
// import Spinner from './Spinner';
const ProgressBar = ({pageType}) => {
  const [progress, setProgress] = useState(0);
  const [taskState, setTaskState] = useState('PENDING');

  useEffect(() => {
    const fetchTaskProgress = async () => {
      const response = JSON.parse(localStorage.getItem('response'));
      if (!response || !response.task_id) {
        throw new Error('Task ID not found in local storage');
      }
      const endpoint  = pageType === "attack" ? `http://127.0.0.1:8000/attack/status/`: `http://127.0.0.1:8000/defense/status/` ;
      try {
        const taskResponse = await axios.get(endpoint+response.task_id);
        
        if (taskResponse.data.success === 'SUCCESS') {
          setTaskState('SUCCESS');
          setTaskState(taskResponse.data.state)
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

  let progressBar;
  if (taskState === 'SUCCESS') {
    progressBar = <p>Task completed successfully!</p>;
  } else{
    progressBar =  <p>Loading</p>;
  } 

  return (
    <div>
      <h2>Progress Bar</h2>
      {progressBar}
    </div>
  );
};

export default ProgressBar;
