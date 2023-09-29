import { Link } from 'react-router-dom';

function AppSelector() {
    return (
        <div>
          <div className="tools">
            <div className="tool">
              <Link to="/words-of-the-week/english" className="pure-button">English</Link>
            </div>
            <div className="tool">
              <Link to="/words-of-the-week/french" className="pure-button">French</Link>
            </div>
          </div>
        </div>
      );
}

export default AppSelector;
