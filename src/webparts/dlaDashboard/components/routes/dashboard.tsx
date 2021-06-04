import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';

import DescriptionIcon from '@material-ui/icons/Description';
import TableChartIcon from '@material-ui/icons/TableChart';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import Account from '../views/account';
import ManageAccounts from '../views/account/ManageAccounts';
import ManageTeams from '../views/account/ManageTeams';
import EditScoreCard from '../views/scorecards/EditScoreCard';
import Programs from '../views/programs/Programs';
import Budgets from '../views/budgets/Budgets';
import Insights from '../views/insights/Insights';
import DLAImprovements from '../views/dlaImprovements/improvements';

import { Dashboard } from '@material-ui/icons';


var dashRoutes = [
    {
        collapse: true,
        path: "/",
        name: "Home",
        icon: HomeIcon,
        component: Account,
        group:["admin","operator","peo","portfolio","program"],
    },{
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
        form: true,
        path: "/teams",
        name: "Teams",
        icon: AccountTreeIcon,
        component: ManageTeams,
        hidden: false,
        group:["admin","portfolio","program"]
    },
    {
        path: "/scores",
        name: "Scorecards",
        icon: TableChartIcon,
        component: EditScoreCard,
        hidden: false,
        group:["admin","operator","portfolio","program"]
    },
    {
        path: "/insights",
        name: "Insights",
        icon: EqualizerIcon,
        component: Insights,
        hidden: false,
        group:["admin","operator","portfolio","program"]
    },
    {
        form: true,
        path: "/improvements",
        name: "Improvements",
        icon: ShowChartIcon,
        component: DLAImprovements,
        hidden: true,
        group:["admin","operator","portfolio","program"]
    },
    {
        //path: 'https://dlamil.dps.mil/:x:/t/C11/N40/ASOCONnect/BRP/EX-vDIq7o3ZLsf9ckxCW8-MBhiP2qVf29YmWr7SOAdkR6Q?e=ztz52T',
        path: "https://dlamil.dps.mil/teams/C11/N40/ASOCONnect/BRP/SitePages/PEO.aspx",
        //path: '/budgets',
        name: "Budgets",
        icon: AccountBalanceIcon,
        component: Budgets,
        hidden: false,
        group:["peo"],
        exact:true,
        breadcrumb: null
    },
    {
        path: "/certifications",
        name: "Certifications",
        icon: DescriptionIcon,
        component: Programs,
        hidden: false,
        group:["portfolio","program"],
        exact:true,
        breadcrumb: null
    },
    {
        path: "/capabilities",
        name: "Capabilities",
        icon: FileCopyIcon,
        component: Programs,
        hidden: false,
        group:["portfolio","program"],
        exact:true,
        breadcrumb: null
    }
];

export default dashRoutes;
