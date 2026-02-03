import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import './Topics.css';

export default function TopicsList() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [openTopic, setOpenTopic] = useState(null);

  // 🔹 Added loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const q = query(collection(db, 'topics'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const topicsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopics(topicsData);
      } catch (err) {
        console.error('❌ Error fetching topics:', err);
      } finally {
        // 🔹 Stop loading after fetch completes
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const formatId = (name) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="topics-page">
      <header className="topics-header">
        <h2>Topics</h2>
      </header>

      {/* 🔹 Only show while loading and no topics */}
      {isLoading && topics.length === 0 && (
        <p style={{ padding: "20px", textAlign: "center" }}>Loading topics...</p>
      )}

      <div className="topics-grid">
        {topics.map(topic => (
          <div
            key={topic.id}
            className={`topic-card ${openTopic === topic.id ? 'open' : ''}`}
          >
            <div
              className="topic-title"
              onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
            >
              {topic.name}
            </div>

            {topic.description && (
              <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>
                {topic.description}
              </p>
            )}

            {openTopic === topic.id && (
              <ul className="subtopics-list">
                {topic.subtopics
                  .sort((a, b) => a.order - b.order)
                  .map((sub, index) => (
                    <li
                      key={index}
                      className="subtopic"
                      onClick={() =>
                        navigate(`/topics/${topic.id}/${formatId(sub.name)}`)
                      }
                    >
                      {sub.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}