import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://autoreactgenerator-g8g9bge3heh0addq.koreasouth-01.azurewebsites.net';

function ProjectList({ username, token, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPageUrl, setCurrentPageUrl] = useState(`${API_BASE_URL}/api/project/`);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentPageUrl) return;

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(currentPageUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      } catch (err) {
        setError('프로젝트 목록을 불러오는 데 실패했습니다.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPageUrl, token]);

  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentPageUrl(nextPageUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      setCurrentPageUrl(prevPageUrl);
    }
  };

  return (
    <div className="project-list-container">
      <header className="project-header">
        <h1>{username}님의 프로젝트</h1>
        <button onClick={onLogout} className="logout-button">
          로그아웃
        </button>
      </header>

      {loading && <p className="loading-message">프로젝트를 불러오는 중...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <>
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>생성자: {project.created_by}</span>
                    <span>생성일: {new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>표시할 프로젝트가 없습니다.</p>
            )}
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={!prevPageUrl || loading}>
              이전
            </button>
            <button onClick={handleNextPage} disabled={!nextPageUrl || loading}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectList;