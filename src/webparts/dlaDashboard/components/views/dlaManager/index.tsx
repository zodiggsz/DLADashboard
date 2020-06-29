import * as React from 'react';
import {  Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PlatformDrawer from '../../drawer';
import Header from './Header';
import portfolioRoutes from '../../routes/portfolio';
import { actions } from '../../../models/programs';
import dlaStyles from './index.module.scss';

export default function DLAManager({user}) {
    const dispatch = useDispatch();
    const group = useSelector(state => state.user.data.Group);
    const programs = useSelector(state => state.programs.list);
    // const user = useSelector(state => state.user.data);
    const [drawer, setDrawer] = React.useState(false);
    const platform = React.useRef(null);

    const toggleDrawer = () => {
        setDrawer(!drawer);
    };

    return (
        <div id={dlaStyles.portfolioManager} ref={platform}>
            <Header drawer={toggleDrawer} user={user} />
            <PlatformDrawer drawer={drawer} />
            <div className={dlaStyles.main}>
                <Switch>
                    {portfolioRoutes.map((route, key) => {
                        if(route.group.includes(group)){
                            if(route.exact){
                                return (
                                    <Route path={route.path} exact component={route.component} key={key}/>
                                );
                            }
    
                            return (
                                <Route path={route.path} component={route.component} key={key}/>
                            );
                        }
                    })}
                    
                </Switch>
            </div>
        </div>
    );
}
