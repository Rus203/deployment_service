// ** Icon imports
import Login from "mdi-material-ui/Login";
import Table from "mdi-material-ui/Table";
import CubeOutline from "mdi-material-ui/CubeOutline";
import HomeOutline from "mdi-material-ui/HomeOutline";
import BarChartIcon from "mdi-material-ui/ChartBar";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";
import CreditCardOutline from "mdi-material-ui/CreditCardOutline";
import AccountPlusOutline from "mdi-material-ui/AccountPlusOutline";
import AlertCircleOutline from "mdi-material-ui/AlertCircleOutline";
import GoogleCirclesExtended from "mdi-material-ui/GoogleCirclesExtended";
import { VerticalNavItemsType } from "../../@core/layouts/types";
import { Logout } from "mdi-material-ui";

// ** Type import
// import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): any => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/",
    },

    {
      title: "Graphs",
      icon: BarChartIcon,
      path: "/graph",
    },
    // {
    //   sectionTitle: "            ",
    // },

    {
      title: "Logout",
      icon: Logout,
      path: "/login",
    },
  ];
};

export default navigation;
