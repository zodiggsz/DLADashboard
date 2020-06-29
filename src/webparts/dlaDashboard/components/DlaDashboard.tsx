import * as React from 'react';
import styles from './DlaDashboard.module.scss';
import { IDlaDashboardProps } from './IDlaDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class DlaDashboard extends React.Component<IDlaDashboardProps, {}> {
  public render(): React.ReactElement<IDlaDashboardProps> {
    return (
      <div className={ styles.dlaDashboard }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <p className={ styles.description }>{escape(this.props.test)}</p>
              <p className={ styles.description }>Loading From: {escape(this.props.page)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
