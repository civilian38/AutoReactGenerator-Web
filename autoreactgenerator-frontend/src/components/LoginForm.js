// src/components/LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

function LoginForm({ onLoginSuccess, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/authentication/token/`, {
        username,
        password,
      });
      // 로그인 성공 시 App.js의 handleLoginSuccess 함수 호출
      onLoginSuccess(response.data, username);
    } catch (err) {
      setError('사용자 이름 또는 비밀번호가 올바르지 않습니다.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="switch-form">
        계정이 없으신가요?{' '}
        <button onClick={switchToRegister}>회원가입</button>
      </p>
    </div>
  );
}

export default LoginForm;