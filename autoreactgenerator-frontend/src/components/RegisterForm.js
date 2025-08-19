// src/components/RegisterForm.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

function RegisterForm({ switchToLogin }) {
  // 1. 새로운 API 명세에 맞게 state 추가
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // 비밀번호 확인용
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [geminiKey, setGeminiKey] = useState(''); // gemini_key_encrypted

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 비밀번호 일치 여부 확인
    if (password !== password2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 2. API 요청 시 보낼 데이터 객체 생성
      const registrationData = {
        username,
        password,
        nickname,
        email,
        bio,
        gemini_key_encrypted: geminiKey,
      };

      // API 호출 (기존 password2는 보내지 않음)
      await axios.post(`${API_BASE_URL}/api/authentication/register/`, registrationData);
      
      setSuccess('회원가입 성공! 2초 후 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        switchToLogin(); // 성공 시 로그인 화면으로 전환
      }, 2000);

    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // 백엔드에서 오는 다양한 에러 메시지를 조합해서 보여줌
        const messages = Object.values(errorData).flat().join(' ');
        setError(messages || '회원가입 중 오류가 발생했습니다.');
      } else {
        setError('회원가입 중 알 수 없는 오류가 발생했습니다.');
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
        {/* 3. 새로운 입력 필드들을 JSX에 추가 */}
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
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
        <div className="input-group">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개"
          />
        </div>
        <div className="input-group">
          <input
            type="text" // 실제 환경에서는 password 타입으로 가리는 것이 좋습니다.
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="Gemini API 키"
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
