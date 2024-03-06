import React, { useState, useEffect } from "react";
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
  InputGroup,
  Table,
  Label,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./../routes"; // Import the routes array

const Privilege = () => {
  const [fetchrole, setFetchRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [formErrors, setFormErrors] = useState({
    role: null, // Selected role
  });

  const [formData, setFormData] = useState({
    role: null, // Selected role
  });

  useEffect(() => {
    (async () => {
      await fetchRoles();
    })();
  }, []);

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

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/roles");

      setFetchRoles(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch roles", error);
      return [];
    }
  };

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

  const handleRoleChange = async (e) => {
    setSelectedRole(e.target.value);
    setFormErrors({ ...formErrors, role: "" });
    setFormData({ ...formData, role: e.target.value });
    await fetchRolePrivilleges(e.target.value);
  };

  const fetchRolePrivilleges = async (roleId) => {
    try {
      const response = await axios.get("/privileges/role/" + roleId);

      const privileges = response.data.data.privileges;
      const privilegeId = response.data.data.privilege_id; // Assuming this is how you get the privilege_id

      // Set privilege_id in formData
      setFormData({ ...formData, privilege_id: privilegeId });
      const updatedUserPrivileges = { ...userPrivileges };

      // Iterate over the privileges obtained from the API response
      privileges.forEach((privilege) => {
        // Find the corresponding route in the userPrivileges state
        const route = Object.keys(updatedUserPrivileges).find(
          (path) => path.replace("/", "") === privilege.path
        );

        if (route) {
          // Update the read, write, and delete privileges based on the API response
          updatedUserPrivileges[route].read = privilege.access_config.read;
          updatedUserPrivileges[route].write = privilege.access_config.write;
          updatedUserPrivileges[route].delete = privilege.access_config.delete;
        }
      });
      setUserPrivileges(updatedUserPrivileges);
    } catch (error) {}
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!selectedRole) {
      setFormErrors({ ...formErrors, role: "Please select a role" });
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
      const isUpdate = formData.privilege_id !== undefined;

      const requestBody = {
        role: selectedRole,
        privileges: privilegeArray,
      };
      if (isUpdate) {
        requestBody.privilege_id = formData.privilege_id;
      }

      const response = await axios.post("/privileges", requestBody);

      if (response) {
        // Display success message
        toast.success("Privileges assigned successfully!");
      }
    } catch (error) {
      // Display error message if API call fails
      console.error("Error assigning privileges:", error);
      toast.error("Failed to assign privileges. Please try again later.");
    }
  };

  // Function to handle clearing all states and checkboxes
  const handleClear = () => {
    setSelectedRole("");
    setFormErrors({ role: null });
    setFormData({ role: null });
    setUserPrivileges(initialUserPrivileges);
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
                        <Label for="role">Role</Label>
                        <InputGroup className="input-group-alternative mb-2">
                          {fetchrole && fetchrole.length > 0 ? (
                            <Input
                              type="select"
                              name="role"
                              id="role"
                              value={selectedRole || ""}
                              onChange={handleRoleChange}
                            >
                              <option key="" value="">
                                Select Role
                              </option>
                              {fetchrole.map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                  {role.role_name}
                                </option>
                              ))}
                            </Input>
                          ) : (
                            <div>No roles available</div>
                          )}
                        </InputGroup>
                        {formErrors.role && (
                          <small className="text-danger">
                            {formErrors.role}
                          </small>
                        )}
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
                  <div className="d-flex justify-content-center mt-4">
                    <Button color="primary" onClick={handleSubmit}>
                      Save Privileges
                    </Button>
                    <Button
                      color="danger"
                      className="ml-3"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </div>
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
