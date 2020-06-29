import * as React from 'react';
import loaderStyles from './index.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function AppLoader({ isLoading }) {
    return (isLoading) ? (
        <div className={loaderStyles.appLoader}>
            
            <CircularProgress size={68} />
            <div style={{ padding:20 }}>
                Working...
            </div>

        </div>
    ) : null;
}
