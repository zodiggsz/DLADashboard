import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import Welcome from './Welcome';
import DLAManager from './views/dlaManager';
import styles from './DlaDashboard.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';
import { Provider } from 'react-redux';
import store from '../models';
import { actions as userActions } from '../models/user';
import 'react-toastify/dist/ReactToastify.css';
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { config } from '../../../config';
import "@pnp/sp/site-users/web";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/files";
import "@pnp/sp/folders";

let web;
let budget;
if (Environment.type === EnvironmentType.Local) {  
    web = Web("https://localhost:4323");
} else {
    web = Web(config.spURi);
    budget = Web(config.fileUri);
}

export function DlaUser(){
    // const userLoaded = useSelector(state => state.user);
    const userData = useSelector(state => state.user.data);
    const [dlaUser, setUser] = React.useState(userData);
    const [email, setEmail] = React.useState('');
    const dispatch = useDispatch();

    const checkUser = async () => {
        let user = await web.currentUser.get();
        // let file = await budget.getFileByServerRelativeUrl("/teams/C36/N71/TestForDB/ALLPEOs.xlsx").getBlob();
        // console.log(file);
        console.log(user);
        let userEmail = user.UserPrincipalName;
        setEmail(userEmail.toLowerCase());
        dispatch(userActions.getUser(userEmail)).then((response) => {
            console.log(response);
            setUser(email);
            const checkEmail = email;
        }).catch((error) => {
            console.log(error);
        });
    };

    React.useEffect(() => {
        checkUser();
    }, []);

    return (
        <div>
        {email && userData.Email === email? 
            <DLAManager user={dlaUser} /> :
            <Welcome
            isAuthenticated={true}
            user={email}
            message="Please check with the administrator for access" />
        }
        </div>
    );

        
}

class DlaHome extends React.Component {
    public render() {
        return (
          <HashRouter> 
            <div className={ styles.dlaDashboard }>
                <DlaUser />
                <ToastContainer position="bottom-right" />
            </div>
          </HashRouter>
        );
    }
}


function AppRouter({page, context}) {
    return (
        <Provider store={store}>
            <DlaHome />
        </Provider>
      );
}

export default AppRouter;