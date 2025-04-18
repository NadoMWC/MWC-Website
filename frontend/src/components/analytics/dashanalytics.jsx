import CompanyStats from "./companystats";
import BarChart from "./barchart";
import LineChart from "./linechart";
import PieChart from "./piechart";
import './analytics.css'

function Analytics () {

    return (
        <div className='analytics'>
            <CompanyStats />
            <BarChart />
            <LineChart />
            <PieChart />
        </div>
    );
};

export default Analytics;