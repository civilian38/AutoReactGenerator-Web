// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

// API 기본 URL (나중에 API가 많아지면 별도 파일로 관리해도 좋습니다)
const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

// ===================================
//   로그인 후 보여줄 메인 콘텐츠 컴포넌트
// ===================================
function MainContent({ username, onLogout }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // API 호출 함수
    const fetchMessage = async () => {
      try {
        // 기존 테스트 API를 호출합니다.
        const response = await axios.get(`${API_BASE_URL}/api/deployTest/hello/`);
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('API 호출에 실패했습니다.');
      }
    };

    fetchMessage();
  }, []); // 처음 렌더링될 때만 실행

  return (
    <header className="App-header">
      <h1>환영합니다, {username}님!</h1>
      <p>API로부터 받은 메시지: {message}</p>
      <button onClick={onLogout} className="logout-button">
        로그아웃
      </button>
    </header>
  );
}


// ===================================
//            메인 App 컴포넌트
// ===================================
function App() {
  // 'token'이 있으면 로그인된 상태, 없으면 로그아웃 상태
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  // 로그인한 사용자의 이름 저장
  const [username, setUsername] = useState(localStorage.getItem('username'));
  // 로그인 폼을 보여줄지, 회원가입 폼을 보여줄지 결정
  const [view, setView] = useState('login'); 

  const handleLoginSuccess = (newToken, loggedInUsername) => {
    // 토큰과 사용자 이름을 localStorage에 저장하여 새로고침해도 유지되도록 함
    localStorage.setItem('authToken', newToken.access);
    localStorage.setItem('username', loggedInUsername);
    setToken(newToken.access);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    // localStorage에서 토큰과 사용자 이름을 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setView('login'); // 로그아웃 후 로그인 화면으로
  };

  // 화면 렌더링 로직
  return (
    <div className="App">
      {token ? (
        // 토큰(로그인 상태)이 있으면 MainContent를 보여줌
        <MainContent username={username} onLogout={handleLogout} />
      ) : (
        // 토큰이 없으면 view 상태에 따라 로그인 또는 회원가입 폼을 보여줌
        <div className="auth-container">
          {view === 'login' ? (
            <LoginForm 
              onLoginSuccess={handleLoginSuccess} 
              switchToRegister={() => setView('register')} 
            />
          ) : (
            <RegisterForm 
              switchToLogin={() => setView('login')} 
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;