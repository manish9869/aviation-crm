import React, { useState } from "react";
import CommonHeader from "components/Headers/CommonHeader";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Table,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./../routes"; // Import the routes array

const Privilege = () => {
  // Initialize user privileges for all routes with all privileges set to false
  const initialUserPrivileges = {};
  routes.forEach((route) => {
    initialUserPrivileges[route.path] = {
      read: false,
      write: false,
      delete: false,
    };
  });

  // State to hold user privileges
  const [userPrivileges, setUserPrivileges] = useState(initialUserPrivileges);
  // State to hold the selected user type
  const [userType, setUserType] = useState("");

  // Function to handle privilege assignment
  const handlePrivilegeChange = (route, privilege, value) => {
    // Update user privileges based on the route and privilege
    const updatedPrivileges = { ...userPrivileges };
    // Initialize the route path object if it doesn't exist
    if (!updatedPrivileges[route.path]) {
      updatedPrivileges[route.path] = {
        read: false,
        write: false,
        delete: false,
      };
    }
    // Set the privilege to the provided value
    updatedPrivileges[route.path][privilege] = value;
    setUserPrivileges(updatedPrivileges);
  };

  // Function to handle "Select All" checkbox
  const handleSelectAll = (privilege, checked) => {
    const updatedPrivileges = { ...userPrivileges };
    routes.forEach((route) => {
      // Initialize the route path object if it doesn't exist
      if (!updatedPrivileges[route.path]) {
        updatedPrivileges[route.path] = {
          read: false,
          write: false,
          delete: false,
        };
      }
      updatedPrivileges[route.path][privilege] = checked;
    });
    setUserPrivileges(updatedPrivileges);
  };

  // Function to handle user type selection
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!userType) {
      // Display error message if user type is not selected
      toast.error("Please select a user type.");
      return;
    }

    const privilegeArray = [];
    // Iterate over the userPrivileges object to construct the array
    Object.keys(userPrivileges).forEach((path) => {
      const accessConfig = userPrivileges[path];
      const routeName = routes.find((route) => route.path === path)?.name || "";
      privilegeArray.push({
        path: path.replace("/", ""), // Remove the leading '/'
        access_config: accessConfig,
        route_name: routeName,
      });
    });

    // Send the array of privilege objects to the API
    try {
      // Make API call here to save user privileges for the selected user type
      console.log("User Type:", userType);
      console.log("Privilege Array:", privilegeArray);

      console.log("Privilege Array:", JSON.stringify(privilegeArray));
      // Display success message
      toast.success("Privileges assigned successfully!");
    } catch (error) {
      // Display error message if API call fails
      console.error("Error assigning privileges:", error);
      toast.error("Failed to assign privileges. Please try again later.");
    }
  };

  return (
    <>
      <CommonHeader />
      <Container className="mt--9" fluid>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3>Assign Privileges</h3>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup>
                        <label>User Type</label>
                        <Input
                          type="select"
                          name="userType"
                          value={userType}
                          onChange={handleUserTypeChange}
                        >
                          <option value="">Select User Type</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Page Name</th>
                        <th>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              onChange={(e) =>
                                handleSelectAll("read", e.target.checked)
                              }
                            />{" "}
                            Read
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              onChange={(e) =>
                                handleSelectAll("write", e.target.checked)
                              }
                            />{" "}
                            Write
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              onChange={(e) =>
                                handleSelectAll("delete", e.target.checked)
                              }
                            />{" "}
                            Delete
                          </FormGroup>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((route) => (
                        <tr key={route.path}>
                          <td>{route.name}</td>
                          <td>
                            <FormGroup check>
                              <Input
                                type="checkbox"
                                checked={
                                  userPrivileges[route.path]?.read || false
                                }
                                onChange={(e) =>
                                  handlePrivilegeChange(
                                    route,
                                    "read",
                                    e.target.checked
                                  )
                                }
                              />
                            </FormGroup>
                          </td>
                          <td>
                            <FormGroup check>
                              <Input
                                type="checkbox"
                                checked={
                                  userPrivileges[route.path]?.write || false
                                }
                                onChange={(e) =>
                                  handlePrivilegeChange(
                                    route,
                                    "write",
                                    e.target.checked
                                  )
                                }
                              />
                            </FormGroup>
                          </td>
                          <td>
                            <FormGroup check>
                              <Input
                                type="checkbox"
                                checked={
                                  userPrivileges[route.path]?.delete || false
                                }
                                onChange={(e) =>
                                  handlePrivilegeChange(
                                    route,
                                    "delete",
                                    e.target.checked
                                  )
                                }
                              />
                            </FormGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Button color="primary" onClick={handleSubmit}>
                    Save Privileges
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Privilege;
