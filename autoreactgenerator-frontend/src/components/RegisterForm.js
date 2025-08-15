// src/components/RegisterForm.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

function RegisterForm({ switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/authentication/register/`, {
        username,
        password,
        password2,
      });
      setSuccess('회원가입 성공! 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        switchToLogin(); // 2초 후 로그인 화면으로 전환
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // Django에서 오는 다양한 에러 메시지를 조합해서 보여줌
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>회원가입</h2>
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
        <div className="input-group">
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="비밀번호 확인"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? '가입 중...' : '가입하기'}
        </button>
      </form>
      <p className="switch-form">
        이미 계정이 있으신가요?{' '}
        <button onClick={switchToLogin}>로그인</button>
      </p>
    </div>
  );
}

export default RegisterForm;