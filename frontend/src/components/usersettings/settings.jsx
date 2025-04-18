import './settings.css'
import Colors from './colors';
import Defaults from './defaults';
import Notifications from './notifications';

function Settings () {

    return (
        <div className='settings-container'>
            <Colors />
            <Defaults />
            <Notifications />
        </div>
    );
};

export default Settings;