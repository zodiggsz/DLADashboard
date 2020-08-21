import * as React from 'react';
import { useSelector } from 'react-redux';
// import Avatar from '../../avatar';
// import Nav from '../../navs/PFMainNav';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
    Button,
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../DlaDashboard.module.scss';
import headerStyles from './header.module.scss';

interface NavBarProps {
    isAuthenticated : boolean;
    authButtonMethod : any;
    user : any;
}

interface NavBarState {
    isOpen : boolean;
}
  
function UserAvatar(props: any) {
    // If a user avatar is available, return an img tag with the pic
    if (props.user.avatar) {
    return <img
            src={props.user.avatar} alt="user"
            className="rounded-circle align-self-center mr-2"
            style={{width: '32px'}}></img>;
    }

    // No avatar available, return a default icon
    return <FontAwesomeIcon icon={faUserCircle} className="rounded-circle align-self-center mr-2" />;
}
  
function AuthNavItem(props: NavBarProps) {
    // If authenticated, return a dropdown with the user's info and a
    // sign out button
    if (props.isAuthenticated) {
    return (
        <UncontrolledDropdown>
        <DropdownToggle nav caret>
            <UserAvatar user={props.user}/>
        </DropdownToggle>
        <DropdownMenu right>
            <h5 className="dropdown-item-text mb-0">{props.user.displayName}</h5>
            <p className="dropdown-item-text text-muted mb-0">{props.user.email}</p>
            <DropdownItem divider />
            <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
        </DropdownMenu>
        </UncontrolledDropdown>
    );
    }

    // Not authenticated, return a sign in link
    return (
    <NavItem>
        <Button
        onClick={props.authButtonMethod}
        className="btn-link nav-link border-0"
        color="link">Sign In</Button>
    </NavItem>
    );
}

export default function Header({drawer = () => {}, user}) {
    // const user = useSelector(state => state.user.data);
    // const group = useSelector(state => state.user.group[0]);
    // const title = (group === 'etmAdmin') ? 'ETM Admin' : 
    //     (group === 'peo') ? 'PEO' : 'Portfolio Manager';

    const toggleDrawer = () => {
        drawer();
    };

    const toggleGroup = (group) => {
        switch (group) {
            case 'admin':
                return 'ECM Admin';
                break;
            case 'operator':
                return 'ECM Operator';
                break;
            case 'peo':
                return 'PEO';
                break;
            default:
                break;
        }
    };

    return (
        <header className={headerStyles.pfHeader}>
            <div className={styles.wrap}>
                <div className={`${styles.row}`}>
                    <div className={headerStyles.toolbar}>
                        <IconButton onClick={toggleDrawer}>
                            <MenuIcon style={{color:"#ffffff"}} />
                        </IconButton>
                    </div>

                    <div>
                        <h3 className={headerStyles.header}>{toggleGroup(user.Group)}</h3>
                        <h5 className={headerStyles.pfUser}>{user.Title}</h5>
                    </div>
                </div>

            </div>
        </header>
    );
}