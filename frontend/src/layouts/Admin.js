import React, { useContext } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { AuthContext } from "../components/Auth/AuthContext";

import routes from "routes.js";

const Admin = (props) => {
  const { userData } = useContext(AuthContext);

  const mainContent = React.useRef(null);
  const location = useLocation();

  const hasReadAccess = (path) => {
    if (!userData || !userData.role || !userData.role.privileges[0].privileges)
      return false; // No privileges available

    const privileges = userData.role.privileges[0].privileges;

    for (let i = 0; i < privileges.length; i++) {
      const privilege = privileges[i];
      if ("/" + privilege.path === path && privilege.access_config.read) {
        return true;
      }
    }
    return false;
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.reduce((acc, prop, key) => {
      if (prop.layout === "/admin" && hasReadAccess(prop.path)) {
        acc.push(
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      }
      if (prop.sub_menu && prop.sub_menu.length > 0) {
        prop.sub_menu.forEach((subItem, subKey) => {
          if (subItem.layout === "/admin" && hasReadAccess(subItem.path)) {
            acc.push(
              <Route
                path={subItem.path}
                element={subItem.component}
                key={`${key}-${subKey}`}
                exact
              />
            );
          }
        });
      }
      return acc;
    }, []);
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        userData={userData}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
