import Index from "views/Index.js";
import Register from "views/Register.js";
import Login from "views/Login.js";
import Icons from "views/Icons";
import Maps from "views/Maps";
import User from "views/User";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-shop text-primary",
    component: <Index />,
    layout: "/admin",
    sub_menu: [],
  },
  {
    path: "/user",
    name: "User",
    icon: "ni ni-shop text-primary",
    component: <User />,
    layout: "/admin",
    sub_menu: [],
  },
  {
    name: "Customer",
    link: null,
    icon: "ni ni-single-copy-04 text-pink",
    layout: "/auth",
    sub_menu: [
      {
        path: "/register",
        name: "Register",
        icon: "ni ni-circle-08 text-pink",
        component: <Register />,
        layout: "/auth",
      },
      {
        path: "/login",
        name: "Login",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
      },
    ],
    isOpen: false,
  },
  {
    name: "Components",
    link: null,
    icon: "ni ni-archive-2 text-green",
    layout: "/admin",
    sub_menu: [
      {
        path: "/icons",
        name: "Buttons",
        icon: "ni ni-circle-08 text-pink",
        component: <Icons />,
        layout: "/admin",
      },
      {
        path: "/maps",
        name: "Cards",
        icon: "ni ni-circle-08 text-pink",
        component: <Maps />,
        layout: "/admin",
      },
    ],
    isOpen: false,
  },
];
export default routes;
