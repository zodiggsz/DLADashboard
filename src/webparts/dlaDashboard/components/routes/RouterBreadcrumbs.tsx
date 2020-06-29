import * as React from 'react';
import { NavLink } from 'react-router-dom';
import portfolioRoutes from './portfolio';
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import './index.module.scss';

const breadcrumbLink = ( event ) => {
    console.log(event);
};

export const RouterBreadcrumbs = withBreadcrumbs(
    portfolioRoutes, { 
        excludePaths: [
            '/',
            '/accounts/peo', 
            '/program/*',
            '/program/:user/:id',
            '/program/:user/:id/data/'
        ] 
    })(({ breadcrumbs }) => (
    <React.Fragment>
        <Breadcrumbs className="breadcrumbs" separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {breadcrumbs.map(({ match, breadcrumb }) => (
                <Link color="inherit" href={match.url} onClick={breadcrumbLink} key={match.url}>
                    {breadcrumb}
                </Link>
            ))}
        </Breadcrumbs>
    </React.Fragment>
));

