import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const apiURL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net/api/deployTest/hello/';

  useEffect(() => {
    // API 호출 함수
    const fetchMessage = async () => {
      try {
        const response = await axios.get(apiURL);
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('API 호출에 실패했습니다.');
      }
    };

    fetchMessage();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

  return (
    <div className="App">
      <header className="App-header">
        <h1>Django REST Framework API</h1>
        <p>API로부터 받은 메시지: {message}</p>
      </header>
    </div>
  );
}

export default App;