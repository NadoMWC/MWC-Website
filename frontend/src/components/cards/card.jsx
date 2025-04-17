import './card.css'
import { Link } from 'react-router-dom';


function Card({ icon, featureName, image, link, alt, message }) {
    return (
      <Link to={link}>
        <div className='card' onClick={() => console.log(`Card clicked: ${featureName}`)}>
          <img className="star-image" src={image} alt={alt} />
          <div className="message">{message}</div>
          <div className="feature-name">{featureName}</div>
          <div className="icons">
            <strong>
              <span className="check">{icon}</span>
            </strong>
          </div>
        </div>
      </Link>
    );
  }
  
  export default Card;