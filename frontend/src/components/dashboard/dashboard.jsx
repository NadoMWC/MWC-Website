import './dashboard.css'
import React, { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance.js'
import Cards from '../cards/cards.jsx'
function Dashboard() {
    

    return (
        <div>
            <Cards />
        </div>
    );
}

export default Dashboard;
