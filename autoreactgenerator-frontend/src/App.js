import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm'; // 새로 추가
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [view, setView] = useState('login');
  const [page, setPage] = useState('projectList'); // 로그인 후 페이지 전환을 위한 상태

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
    setPage('projectList'); // 로그인 성공 시 항상 프로젝트 목록으로 시작
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setView('login');
  };

  // 현재 화면을 렌더링하는 함수
  const renderPage = () => {
    switch(page) {
      case 'createProject':
        return (
          <ProjectForm
            token={token}
            onProjectCreated={() => setPage('projectList')} // 성공 시 목록으로
            onCancel={() => setPage('projectList')} // 취소 시 목록으로
          />
        );
      case 'projectList':
      default:
        return (
          <ProjectList
            username={username}
            token={token}
            onLogout={handleLogout}
            switchToCreate={() => setPage('createProject')} // 생성 페이지로 전환
          />
        );
    }
  }

  return (
    <div className="App">
      {token ? (
        // 로그인 상태: page 상태에 따라 다른 컴포넌트 렌더링
        renderPage()
      ) : (
        // 로그아웃 상태: 로그인/회원가입 폼
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