import { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [taskState, setTaskState] = useState('PENDING');

  useEffect(() => {
    const fetchTaskProgress = async () => {
      const response = JSON.parse(localStorage.getItem('response'));
      if (!response || !response.task_id) {
        throw new Error('Task ID not found in local storage');
      }

      try {
        const taskResponse = await axios.get(`http://127.0.0.1:8000/task-status/${response.task_id}`);
        if (taskResponse.data.state === 'SUCCESS') {
          setTaskState('SUCCESS');
        } else {
          setTaskState(taskResponse.data.state);
          setProgress(taskResponse.data.progress);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(fetchTaskProgress, 1000);

    return () => clearInterval(interval);
  }, []);

  let progressBar;
  if (taskState === 'SUCCESS') {
    progressBar = <p>Task completed successfully!</p>;
  } else if (taskState === 'PENDING') {
    progressBar = <progress value={progress} max="100">Processing...</progress>;
  } else {
    progressBar = <p>Error: Task failed with status {taskState}</p>;
  }

  return (
    <div>
      <h2>Progress Bar</h2>
      {progressBar}
    </div>
  );
};

export default ProgressBar;
