import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
          <div className="apps">
            <div className="app-icon">
              <Link to="/words-of-the-week/french" className="pure-button">French</Link>
            </div>
          </div>
        </div>
      );
}

export default Home;
