import BarChartIcon from "mdi-material-ui/ChartBar";
import HomeOutline from "mdi-material-ui/HomeOutline";

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
      path: "/mini-back/diagrams",
    },
  ];
};

export default navigation;
