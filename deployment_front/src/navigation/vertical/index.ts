// ** Icon imports
import { Logout } from "mdi-material-ui";
import BarChartIcon from "mdi-material-ui/ChartBar";
import HomeOutline from "mdi-material-ui/HomeOutline";

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
      title: "Diagrams",
      icon: BarChartIcon,
      path: "/diagrams",
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
