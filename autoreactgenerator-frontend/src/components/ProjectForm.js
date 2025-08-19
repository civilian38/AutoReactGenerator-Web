// src/components/ProjectForm.js

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

function ProjectForm({ token, onProjectCreated, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/project/`, {
        name,
        description,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onProjectCreated(); // 성공 시 부모 컴포넌트에 알림
    } catch (err) {
      setError('프로젝트 생성에 실패했습니다. 모든 필드를 올바르게 입력했는지 확인해주세요.');
      console.error('Project creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-form-container">
      <header className="project-header">
        <h1>새 프로젝트 생성</h1>
      </header>
      <form onSubmit={handleSubmit} className="form-wrapper-project">
        <div className="input-group">
          <label htmlFor="projectName">프로젝트 이름</label>
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="프로젝트의 이름을 입력하세요"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="projectDescription">프로젝트 설명</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트에 대한 설명을 입력하세요"
            rows="5"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button" disabled={isLoading}>
            취소
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '생성 중...' : '생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectForm;