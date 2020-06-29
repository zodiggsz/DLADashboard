import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionIcon from '@material-ui/icons/Description';
import TableChartIcon from '@material-ui/icons/TableChart';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import AdminAccount from '../views/account';
import ManageTeams from '../views/account/ManageTeams';
import Account from '../views/account/Account';
import EditScoreCard from '../views/scorecards/EditScoreCard';
import Programs from '../views/programs/Programs';
import Insights from '../views/insights/Insights';
import Improvements from '../views/improvements';

import { Dashboard } from '@material-ui/icons';


var portfolioRoutes = [
    {
        collapse: true,
        path: "/",
        name: "Dashboard",
        icon: DashboardIcon,
        component: AdminAccount,
        group:["admin","operator","peo","portfolio","program"],
        exact:true,
        breadcrumb: null
    },
    {
        form: true,
        path: "/teams",
        name: "Teams",
        icon: AccountCircleIcon,
        component: ManageTeams,
        hidden: false,
        group:["admin","operator","peo","portfolio","program"]
    },
    {
        form: true,
        path: "/account/:ID",
        name: "User Account",
        icon: AccountBalanceIcon,
        component: Account,
        hidden: true,
        group:["admin","operator","peo","portfolio","program"],
        exact:true,
        breadcrumb: 'Portfolio Managers'
    },
    {
        path: "/programs",
        name: "Programs",
        icon: AssignmentTurnedInIcon,
        component: Programs,
        hidden: false,
        group:["admin","operator","peo","portfolio","program"],
        exact:true,
        breadcrumb: null
    },
    {
        path: "/programs/:id",
        name: "Programs",
        icon: AssignmentTurnedInIcon,
        component: Programs,
        hidden: false,
        group:["admin","operator","peo","portfolio","program"],
        exact:true,
        breadcrumb: null
    },
    {
        path: "/scores/",
        name: "Scorecards",
        icon: TableChartIcon,
        component: EditScoreCard,
        hidden: false,
        group:["admin","operator","peo","portfolio","program"]
    },
    {
        path: "/insights",
        name: "Insights",
        icon: EqualizerIcon,
        component: Insights,
        hidden: false,
        group:["admin","operator","peo","portfolio","program"]
    },
    {
        form: true,
        path: "/improvements",
        name: "Improvements",
        icon: CheckBoxIcon,
        component: Improvements,
        hidden: true,
        group:["admin","operator","peo","portfolio","program"]
    }
  
];

export default portfolioRoutes;
