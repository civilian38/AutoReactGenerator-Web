import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProjectList from './components/ProjectList'; // 새로 추가된 컴포넌트
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [view, setView] = useState('login'); 

  // 토큰 변경 시 상태 업데이트를 위한 Effect
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    setToken(storedToken);
    setUsername(storedUsername);
  }, []);


  const handleLoginSuccess = (newToken, loggedInUsername) => {
    localStorage.setItem('authToken', newToken.access);
    localStorage.setItem('username', loggedInUsername);
    setToken(newToken.access);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setView('login');
  };

  return (
    <div className="App">
      {token ? (
        // 로그인 상태: ProjectList 컴포넌트 렌더링
        <ProjectList username={username} token={token} onLogout={handleLogout} />
      ) : (
        // 로그아웃 상태: 로그인/회원가입 폼을 포함한 로그인 유도 화면
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <h1 className="main-title">Project Manager</h1>
                <p className="main-subtitle">서비스를 이용하려면 로그인이 필요합니다.</p>
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
        </div>
      )}
    </div>
  );
}

export default App;