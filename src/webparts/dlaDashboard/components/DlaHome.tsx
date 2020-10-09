import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
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
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";

import withAuthProvider, { AuthComponentProps } from '../AuthProvider';

const hideHeader = async () => {
    
    const page = await sp.web.loadClientsidePage("/sites/SPO_PEODashboard/SitePages/PEO-Dashboard.aspx");
    const value = page.showTopicHeader;
    page.showTopicHeader = false;
    // page.layoutType = "Home";
    await page.save();

};

export function DlaUser({user, props}){
    // const userLoaded = useSelector(state => state.user);
    const userData = useSelector(state => state.user.data);
    const userGroup = useSelector(state => state.user.data.Group);
    const [dlaUser, setUser] = React.useState(userData);
    const [email, setEmail] = React.useState(userData);
    const dispatch = useDispatch();
    // hideHeader();
    React.useEffect(() => {
        // console.log(user);
        dispatch(userActions.getUser(user.email)).then((response) => {
            const checkEmail = user.email;
            setUser(response);
            setEmail(checkEmail.toLowerCase());
        });

    }, []);

    console.log(`${email} ${userData.Email}`);
    return (
        <div>
            
        {email == userData.Email ? 
            <DLAManager user={dlaUser} /> :
            <Welcome {...props}
            isAuthenticated={props.isAuthenticated}
            user={dlaUser}
            message="Did Load DlaUser but userData not set"
            authButtonMethod={props.login} />
        }
        </div>
    );

        
}

class DlaHome extends React.Component<AuthComponentProps> {
    public render() {
        let error = null;
        if (this.props.error) {
          error = <ErrorMessage
            message={this.props.error.message}
            debug={this.props.error.debug} />;
        }
    
        return (
          <HashRouter> 
            <div className={ styles.dlaDashboard }>
                <NavBar
                    isAuthenticated={this.props.isAuthenticated}
                    authButtonMethod={this.props.isAuthenticated ? this.props.logout : this.props.login}
                    user={this.props.user}/>
                {this.props.isAuthenticated ? 
                    <DlaUser user={this.props.user} props={this.props} /> :
                    <Container className={ styles.container }>
                        {error}
                        <Route path="/"
                        render={(props) =>
                            <Welcome {...props}
                            isAuthenticated={this.props.isAuthenticated}
                            user={this.props.user}
                            message="Did not Load DlaUser"
                            authButtonMethod={this.props.login} />
                        } />
                    </Container>
                }
                <ToastContainer position="bottom-right" />
            </div>
          </HashRouter>
        );
    }
}


function AppRouter({page, context}) {
    const Component = withAuthProvider(DlaHome);

    return (
        <Provider store={store}>
            <Component />
        </Provider>
      );
}

export default AppRouter;