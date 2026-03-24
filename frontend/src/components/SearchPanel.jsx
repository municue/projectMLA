import {useState, useEffect, useRef} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {db} from './firebase';
import {useNavigate} from 'react-router-dom';
import './SearchPanel.css';

const CACHE_KEY = 'mathTopicsCache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const FALLBACK_TRENDING = [
  'LinearAlgebra', 'Calculus', 'Statistics',
  'Trigonometry', 'Polynomials', 'Probability',
  'Derivatives', 'Integrals', 'Matrices', 'Equations',
];

const FALLBACK_RECOMMENDED = [
  'Integer Exponents', 'Rational Exponents',
  'Polynomials', 'Factoring Polynomials',
  'Linear Equations', 'Quadratic Equations',
  'Graphing Functions', 'Complex Numbers',
];

const formatId = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function SearchPanel() {
  const navigate = useNavigate();
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const trendingRef = useRef(null);
  const recommendedRef = useRef(null);

  useEffect(() => {
    loadLocalTopics();
    loadTrendingFromCache();
  }, []);

  useEffect(() => {
    if (!loading && trendingTopics.length > 0) {
      startScroll(trendingRef);
    }
  }, [loading, trendingTopics]);

  useEffect(() => {
    if (!loading && recommendations.length > 0) {
      startScroll(recommendedRef);
    }
  }, [loading, recommendations]);

  function startScroll(ref) {
    const el = ref.current;
    if (!el) return;

    let scrollAmount = 0;
    const speed = 0.5;

    const scroll = () => {
      scrollAmount += speed;
      if (scrollAmount >= el.scrollHeight / 2) {
        scrollAmount = 0;
      }
      el.scrollTop = scrollAmount;
      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }

  async function loadLocalTopics() {
    try {
      const snapshot = await getDocs(collection(db, 'topics'));
      const topics = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        topics.push({
          id: docSnap.id,
          name: data.name || docSnap.id,
          type: 'topic',
        });

        if (data.subtopics && Array.isArray(data.subtopics)) {
          data.subtopics.forEach((sub) => {
            topics.push({
              id: `${docSnap.id}-${formatId(sub.name)}`,
              name: sub.name,
              parentId: docSnap.id,
              parentTopic: data.name,
              type: 'subtopic',
            });
          });
        }
      });

      setAllTopics(topics);
    } catch (error) {
      console.error('Error loading local topics:', error);
    }
  }

  async function loadTrendingFromCache() {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const {data, timestamp} = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (!isExpired) {
        setTrendingTopics(data.trending || FALLBACK_TRENDING);
        setRecommendations(data.recommended || FALLBACK_RECOMMENDED);
        setLoading(false);
        return;
      }
    }

    await fetchFromOpenAI();
  }

  async function fetchFromOpenAI() {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Return a JSON object with two arrays. ' +
                "1) 'trending': 6 trending math topics as short hashtag strings. " +
                "2) 'recommended': 6 beginner math topics to learn first. " +
                'Return ONLY the JSON, no explanation. ' +
                'Example: {"trending":["LinearAlgebra"],"recommended":["Calculus"]}',
            },
          ],
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: result,
        timestamp: Date.now(),
      }));

      setTrendingTopics(result.trending || FALLBACK_TRENDING);
      setRecommendations(result.recommended || FALLBACK_RECOMMENDED);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setTrendingTopics(FALLBACK_TRENDING);
      setRecommendations(FALLBACK_RECOMMENDED);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const lower = query.toLowerCase();

    const matches = allTopics.filter((item) =>
      item.name.toLowerCase().includes(lower) ||
      (item.parentTopic && item.parentTopic.toLowerCase().includes(lower)),
    );

    setSearchResults(matches);
  }

  function handleTopicClick(item) {
    if (item.type === 'topic') {
      const firstSubtopic = allTopics.find(
        (t) => t.type === 'subtopic' && t.parentId === item.id,
      );
      if (firstSubtopic) {
        navigate(`/topics/${item.id}/${formatId(firstSubtopic.name)}`);
      } else {
        navigate('/topics');
      }
    } else {
      navigate(`/topics/${item.parentId}/${formatId(item.name)}`);
    }
    setSearchQuery('');
    setSearchResults([]);
    setSearching(false);
  }

  function handleTrendingClick(topic) {
    const lower = topic.toLowerCase().replace(/\s+/g, '-');
    const match = allTopics.find((t) =>
      t.name.toLowerCase().includes(lower) ||
      t.id.toLowerCase().includes(lower),
    );
    if (match) handleTopicClick(match);
  }

  function handleRecommendedClick(item) {
    const lower = item.toLowerCase();
    const match = allTopics.find((t) =>
      t.name.toLowerCase().includes(lower),
    );
    if (match) handleTopicClick(match);
  }

  return (
    <aside className="search-panel">
      <div className="search-header">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search topics..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {searching && (
        <div className="panel-box">
          <h2 className="section-title">Results</h2>
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map((item) => (
                <li key={item.id} onClick={() => handleTopicClick(item)}>
                  {item.type === 'topic' ? '📘' : '📄'} {item.name}
                  {item.parentTopic && (
                    <span style={{
                      color: '#aaa',
                      fontSize: '0.8rem',
                      display: 'block',
                    }}>
                      {item.parentTopic}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{color: '#aaa', fontSize: '0.9rem'}}>
              No results found for "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {!searching && (
        <>
          <div className="panel-box">
            <h2 className="section-title">Trending</h2>
            {loading ? (
              <p style={{color: '#aaa'}}>Loading...</p>
            ) : (
              <div
                ref={trendingRef}
                style={{maxHeight: '180px', overflow: 'hidden'}}
              >
                <ul>
                  {[...trendingTopics, ...trendingTopics].map((topic, index) => (
                    <li key={index} onClick={() => handleTrendingClick(topic)}>
                      #{topic}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="panel-box">
            <h2 className="section-title">Recommended</h2>
            {loading ? (
              <p style={{color: '#aaa'}}>Loading...</p>
            ) : (
              <div
                ref={recommendedRef}
                style={{maxHeight: '180px', overflow: 'hidden'}}
              >
                <ul>
                  {[...recommendations, ...recommendations].map((item, index) => (
                    <li key={index} onClick={() => handleRecommendedClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}