import Index from "views/Index.js";
import User from "views/User";
import Seller from "views/Seller";
import Fleet from "views/Fleet";
import Airport from "views/airport";
import Role from "views/Role";
import Currency from "views/Currency";
import Category from "views/Category";

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
    path: "/category",
    name: "Category",
    icon: "ni ni-shop text-primary",
    component: <Category />,
    layout: "/admin",
    sub_menu: [],
  },
  {
    path: "/fleet",
    name: "Fleet",
    icon: "ni ni-shop text-primary",
    component: <Fleet />,
    path: "/role",
    name: "Role",
    icon: "ni ni-shop text-primary",
    component: <Role />,
    layout: "/admin",
    sub_menu: [],
  },

  {
    path: "/currency",
    name: "Currency",
    icon: "ni ni-shop text-primary",
    component: <Currency />,
    layout: "/admin",
    sub_menu: [],
  },

  {
    path: "/seller",
    name: "seller",
    icon: "ni ni-shop text-primary",
    component: <Seller />,
    layout: "/admin",
    sub_menu: [],
  },

  {
    path: "/airport",
    name: "Airport",
    icon: "ni ni-shop text-primary",
    component: <Airport />,
    layout: "/admin",
    sub_menu: [],
  },
  // {
  //   name: "Customer",
  //   link: null,
  //   icon: "ni ni-single-copy-04 text-pink",
  //   layout: "/auth",
  //   sub_menu: [
  //     {
  //       path: "/register",
  //       name: "Register",
  //       icon: "ni ni-circle-08 text-pink",
  //       component: <Register />,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/login",
  //       name: "Login",
  //       icon: "ni ni-key-25 text-info",
  //       component: <Login />,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/forgot",
  //       name: "Forgot",
  //       icon: "ni ni-key-25 text-info",
  //       component: <Forgot />,
  //       layout: "/auth",
  //     },
  //   ],
  //   isOpen: false,
  // },
];
export default routes;
