import './dashboard.css'
import React from "react";
import Cards from '../cards/cards.jsx'
import CompanyInformation from '../companyvision/company.jsx';
import Analytics from '../analytics/dashanalytics.jsx';
import Settings from '../usersettings/settings.jsx';



function Dashboard() {
    
    return (
        <div>
            <h1>Features</h1>
                <Cards />
            <h1>Company Information</h1>
                <CompanyInformation />
            <h1>Dashboard Analytics</h1>
                <Analytics />
            <h1>User Settings</h1>
                <Settings />
        </div>
    );
};

export default Dashboard;
