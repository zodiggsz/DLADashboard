import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import {
    SPHttpClient,
    SPHttpClientResponse
  } from '@microsoft/sp-http';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DlaDashboardWebPartStrings';
import AppRouter from './components/DlaHome';
import { IDlaDashboardProps } from './components/IDlaDashboardProps';

export interface IDlaDashboardWebPartProps {
    description: string;
    test: string;
    test1: boolean;
    test2: string;
    test3: boolean;
}

export default class DlaDashboardWebPart extends BaseClientSideWebPart <IDlaDashboardWebPartProps> {

  public render(): void {
    const element: React.ReactElement = React.createElement(  AppRouter,
      {
        page: this.context.pageContext.web.absoluteUrl,
        context: this.context.spHttpClient,
      } 
    );

    ReactDom.render(element, this.domElement);
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
                groupName: strings.BasicGroupName,
                groupFields: [
                    PropertyPaneTextField('description', {
                    label: 'Description'
                    }),
                    PropertyPaneTextField('test', {
                    label: 'Multi-line Text Field',
                    multiline: true
                    }),
                    PropertyPaneCheckbox('test1', {
                    text: 'Checkbox'
                    }),
                    PropertyPaneDropdown('test2', {
                    label: 'Dropdown',
                    options: [
                        { key: '1', text: 'One' },
                        { key: '2', text: 'Two' },
                        { key: '3', text: 'Three' },
                        { key: '4', text: 'Four' }
                    ]}),
                    PropertyPaneToggle('test3', {
                    label: 'Toggle',
                    onText: 'On',
                    offText: 'Off'
                    })
              ]
            }
          ]
        }
      ]
    };
  }
}
