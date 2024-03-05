import React, { useEffect, useState } from "react";
import CommonHeader from "components/Headers/CommonHeader";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  FormGroup,
  Form,
  Row,
  Button,
  Input,
  Label,
  InputGroup,
  CustomInput,
} from "reactstrap";
import Select from "react-select";
import Grid from "./../components/ag-grid/Grid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewModal from "components/Modal/Modal";

const User = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedSellerDDL, setSelectedSellerDDL] = useState({});
  const [error, setError] = useState(false);
  const [editeduserId, setEditeduserId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [fetchrole, setFetchRoles] = useState([]);
  const [fetchusertypes, setFetchUserTypes] = useState([]);
  const [fetchsellers, setFetchSellers] = useState([]);

  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    profile_pic: "",
    role: null, // Selected role
    user_type: null, // Selected user type
    seller: null, // Selected seller
    enable: "",
  });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    profile_pic: "",
    role: null, // Selected role
    user_type: null, // Selected user type
    seller: null, // Selected seller
    enable: 0,
  });

  /*#region AG GRID Handlers and Column Defination */

  const handleEdit = async (userId) => {
    console.log("userId", userId);
    // Fetch user details by ID and set form fields

    await fetchSellers();
    await fetchUserDetails(userId);
    console.log("FormData--->" + formData);
    setIsEdit(true); // Set edit mode
    setEditeduserId(userId); // Set the ID of the user being edited
    console.log(editeduserId);
  };

  const handleDelete = async (userId) => {
    try {
      console.log("Id: " + userId);
      const response = await axios.delete(`/user/${userId}`);

      if (response.status === 200) {
        // Assuming your API returns a success status code
        toast.success("User deleted successfully");

        // After successfully deleting, fetch the latest data and update the grid
        const getResponse = await axios.get("/user");
        setRowData(getResponse.data.data);
        // const getResponse = await axios.get("/user");
        // setRowData(getResponse.data.data);
      } else {
        toast.error("Failed to delete User");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting User");
    }
  };

  const handleView = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`);
      if (response.status === 200) {
        console.log("We are inside handle view");
        const userDetails = response.data.data;
        console.log("User Details: " + JSON.stringify(userDetails));
        setSelectedUserDetails(userDetails);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching user details");
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "First Name",
      field: "firstname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Last Name",
      field: "lastname",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Contact Email",
      field: "email",
      sortable: true,
      filter: true,
    },
  ]);

  /* #endregion AG GRID */

  /*#region Validation FORM */
  const validateForm = () => {
    let valid = true;
    const errors = {};

    // Destructure formData
    const {
      firstname,
      lastname,
      email,
      password,
      profile_pic,
      role,
      user_type,
      seller,
      enable,
    } = formData;

    // console.log(profile_pic, role, user_type, seller);

    if (!firstname.trim()) {
      errors.firstname = "First Name is required";
      valid = false;
    }

    if (!lastname.trim()) {
      errors.lastname = "Last Name is required";
      valid = false;
    }

    if (!email.trim()) {
      errors.email = "Contact Email is required";
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Invalid email address";
        valid = false;
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required";
      valid = false;
    }

    if (!profile_pic.trim()) {
      errors.profile_pic = "Profile pic is required";
      valid = false;
    }

    if (enable === null) {
      errors.enable = "Enable is required";
      valid = false;
    } else if (isNaN(enable) || enable < 0) {
      errors.enable = "Enable must be a valid non-negative number";
      valid = false;
    }

    if (!role) {
      errors.role = "Role is required";
      valid = false;
    }

    if (!user_type) {
      errors.user_type = "User Type is required";
      valid = false;
    }

    if (!seller) {
      errors.seller = "Seller is required";
      valid = false;
    }

    // Set form errors state
    setFormErrors(errors);

    return valid;
  };

  /*#endregion Validation FORM */

  /*#region API CALLS */

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

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get("/user-type");
      // console.log("User Type: " + response.data.data);
      setFetchUserTypes(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user types", error);
      return [];
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await axios.get("/sellers");

      const sellersOptions = response.data.data.map((seller) => ({
        value: seller.seller_id,
        label: seller.seller_commercial_name,
      }));

      // Set the state with the options
      setFetchSellers(sellersOptions);

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch sellers", error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  const fetchData = async () => {
    try {
      setError(false);

      // Fetch roles, user types, and sellers
      const [role, user_type, seller, userData] = await Promise.all([
        fetchRoles(),
        fetchUserTypes(),
        fetchSellers(),
        axios.get("/user"),
      ]);

      setRowData(userData.data.data);
      // console.log("UserData=========> " + JSON.stringify(userData.data.data));

      // Update form data with fetched roles, user types, and sellers
      setFormData((prevFormData) => ({
        ...prevFormData,
        role,
        user_type,
        seller,
      }));

      resetForm();
      // console.log("Form Data " + JSON.stringify(formData));
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch user data");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/user/${userId}`);

      if (response.status === 200) {
        const userDetails = response.data.data;

        setSelectedSellerDDL({
          value: userDetails.seller.seller_id,
          label: userDetails.seller.seller_commercial_name,
        });

        // Set form fields with user details
        setFormData({
          firstname: userDetails.firstname,
          lastname: userDetails.lastname,
          email: userDetails.email,
          password: userDetails.password,
          profile_pic: userDetails.profile_pic,
          enable: userDetails.enable,
          role: userDetails.role ? userDetails.role.role_id : null,
          user_type: userDetails.user_type
            ? userDetails.user_type.login_user_type_id
            : null,
          seller: userDetails.seller ? userDetails.seller.seller_id : null,
        });
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching user details");
    }
  };

  /*#endregion API CALLS */

  /*#region BUTTON CLICKS */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert 'enable' field to a number
    const formDataWithNumber = {
      ...formData,
      enable: parseInt(formData.enable, 10),
    };

    console.log("Form Data after submitting " + formDataWithNumber);
    const url = isEdit ? `/user/${editeduserId}` : "/user";
    console.log("formData====>", formData);
    axios
      .request({
        url,
        method: isEdit ? "put" : "post",
        data: formDataWithNumber,
      })
      .then(async (result) => {
        console.log("Add API-------> " + result);
        if (result) {
          toast.success(isEdit ? "Updated Successfully" : "Added Successfully");
          const getResponse = await axios.get("/user");
          setRowData(getResponse.data.data);

          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Reset form and edit mode after submission
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(isEdit ? "Failed to update User" : "Failed to add User");
      });
  };

  const handleChange = (e) => {
    console.log("e.target.value====>", e);

    if (e === null || e === undefined) {
      setSelectedSellerDDL({ value: -1, label: "Select Seller" });
      setFormData((prevFormData) => ({
        ...prevFormData,
        seller: null,
      }));
      return;
    }
    let name = null;
    let value = null;
    if (e.hasOwnProperty("label")) {
      name = "seller";
      value = e.value;
      setSelectedSellerDDL({ value: value, label: e.label });
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    console.log("we are in Handle change for " + name + " : " + value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    console.log("selectedSellerDDL===>", selectedSellerDDL);
  };

  const resetForm = () => {
    setIsEdit(false);
    setSelectedSellerDDL({ value: null, label: null });
    setEditeduserId(null);
    setIsViewModalOpen(false);
    setSelectedUserDetails(null);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      profile_pic: "",
      role: null, // Selected role
      user_type: null, // Selected user type
      seller: null, // Selected seller
      enable: 0,
    });
    setFormErrors({});
  };

  /*#endregion BUTTON CLICKS */

  /*#region MODAL CLOSE */

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUserDetails(null);
  };

  const labelsMapping = {
    login_user_id: "User Id",
    firstname: "User First Name",
    lastname: "User Last Name",
    email: "Email",
    password: "Password",
    profile_pic: "Profile Pic",
    date_time_insert: "Inserted Date",
    enable: "Enable",
    role: "Role",
    // role.role_name: "Role Name",
    user_type: "User Type",
    seller: "Seller",
  };

  /*#endregion MODAL CLOSE */

  return (
    <>
      {/* Blue Background Header */}
      <CommonHeader />
      {/* Page content */}

      <Container className="mt--9" fluid>
        <Row>
          <div className="col-md-5">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">{isEdit ? "Edit User" : "Add User"}</h3>
              </CardHeader>
              <CardBody>
                <Form role="form">
                  <FormGroup>
                    <Label for="firstname">User First Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="firstname"
                        name="firstname"
                        value={formData.firstname}
                        placeholder="User First Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.firstname && (
                      <small className="text-danger">
                        {formErrors.firstname}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="lastname">User Last Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        placeholder="User Last Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.lastname && (
                      <small className="text-danger">
                        {formErrors.lastname}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.email && (
                      <small className="text-danger">{formErrors.email}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="id_number"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        type="password"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.password && (
                      <small className="text-danger">
                        {formErrors.password}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="profilepic">Profile Pic</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="profilepic"
                        name="profile_pic"
                        value={formData.profile_pic}
                        placeholder="Profile Pic"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.profile_pic && (
                      <small className="text-danger">
                        {formErrors.profile_pic}
                      </small>
                    )}
                  </FormGroup>
                  {/* <FormGroup>
                    <Label for="enable">Enable</Label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        id="enable"
                        name="enable"
                        placeholder="enable"
                        type="number"
                        value={formData.enable}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.enable && (
                      <small className="text-danger">{formErrors.enable}</small>
                    )}
                  </FormGroup> */}
                  <FormGroup>
                    <Label for="enable">Enable</Label>
                    <CustomInput
                      type="switch"
                      id="enable"
                      name="enable"
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "enable",
                            value: e.target.checked ? 1 : 0,
                          },
                        })
                      }
                      checked={formData.enable === 1}
                      label={formData.enable === 1 ? "Enabled" : "Disabled"}
                    />
                    {formErrors.enable && (
                      <small className="text-danger">{formErrors.enable}</small>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="role">Role</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      {fetchrole && fetchrole.length > 0 ? (
                        <Input
                          type="select"
                          name="role"
                          id="role"
                          onChange={handleChange}
                          value={formData.role || ""}
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
                      <small className="text-danger">{formErrors.role}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="user_type">User Type</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      {fetchusertypes && fetchusertypes.length > 0 ? (
                        <Input
                          type="select"
                          name="user_type"
                          id="user_type"
                          onChange={handleChange}
                          value={formData.user_type || ""}
                        >
                          <option value="">Select User Type</option>
                          {fetchusertypes.map((userType) => (
                            <option
                              key={userType.login_user_type_id}
                              value={userType.login_user_type_id}
                            >
                              {userType.user_type}
                            </option>
                          ))}
                        </Input>
                      ) : (
                        <div>No user types available</div>
                      )}
                    </InputGroup>
                    {formErrors.user_type && (
                      <small className="text-danger">
                        {formErrors.user_type}
                      </small>
                    )}
                  </FormGroup>

                  {/* Seller dropdown */}
                  <FormGroup>
                    <Label for="seller">Seller</Label>
                    {fetchsellers && fetchsellers.length > 0 ? (
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="ddlSeller"
                        value={fetchsellers.find(
                          (obj) => obj.value === selectedSellerDDL.value
                        )}
                        onChange={handleChange}
                        options={fetchsellers}
                      />
                    ) : (
                      <div>No sellers available</div>
                    )}
                    {formErrors.seller && (
                      <small className="text-danger">{formErrors.seller}</small>
                    )}

                    {/* {fetchsellers && fetchsellers.length > 0 ? (
                      <Select
                        // value={formData.seller || ""}
                        onChange={handleChange}
                        options={fetchsellers.map((seller) => ({
                          value: seller.seller_id.toString(),
                          label: seller.seller_commercial_name,
                        }))}
                        value={
                          formData.seller
                            ? {
                                value: formData.seller, // Convert to string if necessary
                                label:
                                  fetchsellers.find((s) => s.seller_id === formData.seller)
                                    ?.seller_commercial_name || '',
                              }
                            : null
                        }
                        // onChange={(selectedOption) => {
                        //   setFormData((prevFormData) => ({
                        //     ...prevFormData,
                        //     seller: selectedOption
                        //       ? selectedOption.value
                        //       : null,
                        //   }));
                        // }}

                        isClearable={true}
                        isSearchable={true}
                      />
                    ) : (
                      <div>No sellers available</div>
                    )}
                    {formErrors.seller && (
                      <small className="text-danger">{formErrors.seller}</small>
                    )} */}
                  </FormGroup>

                  <div className="text-center">
                    <Button
                      className="mt-4"
                      color="danger"
                      type="reset"
                      onClick={() => {
                        resetForm();
                        // setIsEdit(false); // Reset edit mode
                        // setEditeduserId(null); // Reset edited user ID
                        // Clear the seller value in formData
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          seller: null,
                        }));
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      className="mt-4"
                      color={isEdit ? "info" : "primary"}
                      type="button"
                      onClick={handleSubmit}
                    >
                      {isEdit ? "Update" : "Submit"}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>

          <div className="col-md-7">
            <div className="ag-theme-quartz" style={{ height: 500 }}>
              <Grid
                rowData={rowData}
                columnDefs={columnDefs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                idKey="login_user_id" // or "user_id" depending on your use case
              />
            </div>
          </div>
          <ToastContainer />
        </Row>
      </Container>

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedUserDetails}
        labelsMapping={labelsMapping}
      />
    </>
  );
};

export default User;
