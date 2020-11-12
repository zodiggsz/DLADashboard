import * as React from 'react';
import {
  Button,
  Jumbotron } from 'reactstrap';
import styles from './DlaDashboard.module.scss';

interface WelcomeProps {
  isAuthenticated : boolean;
  user : any;
  message : string;
}

interface WelcomeState {
  isOpen : boolean;
}

function WelcomeContent(props: WelcomeProps) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome {props.user}!</h4>
        <p>{props.message}</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
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
          message={this.props.message} />
      </Jumbotron>
    );
  }
}