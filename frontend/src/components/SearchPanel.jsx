import './SearchPanel.css';

export default function SearchPanel() {
  return (
    <aside className="search-panel">
      <div className='search-header'>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="panel-box">
        <h2 className="section-title">Trending</h2>
        <ul>
          <li>#LinearAlgebra</li>
          <li>#CalculusBasics</li>
          <li>#Statistics101</li>
          <li>#Trigonometry</li>
          <li>#ComplexNumbers</li>
          <li>#LinearAlgebra</li>
          <li>#CalculusBasics</li>
          <li>#Statistics101</li>
          <li>#Trigonometry</li>
        </ul>
      </div>

      <div className="panel-box">
        <h2 className="section-title">Recommended</h2>
        <ul>
          <li>Practice History</li>
          <li>Daily Challenge</li>
          <li>New Topics</li>
        </ul>
      </div>
    </aside>
  );
}
