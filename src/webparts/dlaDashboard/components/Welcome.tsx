import * as React from 'react';
import {
  Button,
  Jumbotron } from 'reactstrap';
import styles from './DlaDashboard.module.scss';

interface WelcomeProps {
  isAuthenticated : boolean;
  authButtonMethod : any;
  user : any;
}

interface WelcomeState {
  isOpen : boolean;
}

function WelcomeContent(props: WelcomeProps) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome {props.user.displayName}!</h4>
        <p>If you need access to the DLA Dashboard<br />Please contact your ECM Administrator for Access</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <Button color="primary" className={styles.dlaButton} onClick={props.authButtonMethod}>Click here to sign in</Button>;
}

export default class Welcome extends React.Component<WelcomeProps, WelcomeState> {
    public render() {
    return (
      <Jumbotron className={styles.jumbotron}>
        <h1>DLA Dashboard</h1>
        <p className="lead">
            MVP Dashboard for ECM Administration
        </p>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod} />
      </Jumbotron>
    );
  }
}