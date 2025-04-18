import './company.css'
import InspirationalWords from './inspirationalwords.jsx'
import Reviews from './reviews.jsx'
import Weather from './weather.jsx'
import Merchandise from './merchandise.jsx';
import News from './news.jsx';


function CompanyInformation () {

    return (
        <div className='company-information'>
            <InspirationalWords />
            <Reviews />
            <Weather />
            <News />
            <Merchandise />
        </div>
    );
};

export default CompanyInformation;