import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonHeader from "components/Headers/CommonHeader";
import Grid from "components/ag-grid/Grid";
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
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewModal from "components/Modal/Modal";

const Role = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedRoleId, setEditedRoleId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // State to track if form is in edit mode
  const [formErrors, setFormErrors] = useState({
    role_name: "",
    role_description: "",
  });

  const [formData, setFormData] = useState({
    role_name: "",
    role_description: "",
  });

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRoleDetails(null);
  };

  const labelsMapping = {
    role_name: "Role Name",
    role_description: "Role Description",
    // Add more mappings as needed
  };

  const handleEdit = async (roleId) => {
    try {
      const response = await axios.get(`/roles/${roleId}`);
      if (response.status === 200) {
        const roleDetails = response.data.data;
        setFormData({
          role_name: roleDetails.role_name,
          role_description: roleDetails.role_description,
        });
        setIsEdit(true); // Set edit mode to true when editing
        setEditedRoleId(roleId);
      } else {
        toast.error("Failed to fetch role details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching role details");
    }
  };

  const handleDelete = async (roleId) => {
    try {
      const response = await axios.delete(`/roles/${roleId}`);
      if (response.status === 200) {
        toast.success("Role deleted successfully");
        const updatedResponse = await axios.get("/roles");
        setRowData(updatedResponse.data.data);
      } else {
        toast.error("Failed to delete role");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting role");
    }
  };

  const handleView = async (roleId) => {
    try {
      const response = await axios.get(`/roles/${roleId}`);
      if (response.status === 200) {
        const roleDetails = response.data.data;
        setSelectedRoleDetails(roleDetails);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch role details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching role details");
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Role Name",
      field: "role_name",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Role Description",
      field: "role_description",
      filter: true,
      sortable: true,
    },
  ]);

  const validateForm = () => {
    let errors = {};

    if (!formData.role_name.trim()) {
      errors.role_name = "Role name is required";
    }

    if (!formData.role_description.trim()) {
      errors.role_description = "Role description is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const fetchRoles = async () => {
    try {
      setError(false);
      const response = await axios.get("/roles");
      setRowData(response.data.data);
      return response;
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch role data");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const url = isEdit ? `/roles/${editedRoleId}` : "/roles";
      const method = isEdit ? "put" : "post";
      const response = await axios[method](url, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success(isEdit ? "Role updated successfully" : "Role added successfully");
        const updatedResponse = await fetchRoles();
        setRowData(updatedResponse.data.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetForm();
      } else {
        toast.error("Failed to submit role data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting role data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditedRoleId(null);
    setIsViewModalOpen(false);
    setSelectedRoleDetails(null);
    setFormData({
      role_name: "",
      role_description: "",
    });
    setFormErrors({});
  };

  return (
    <>
      <CommonHeader />
      <Container className="mt--9" fluid>
        <Row>
          <Col md={5}>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">{isEdit ? 'Update' : 'Add'} Role</h3>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Role Name"
                        type="text"
                        name="role_name"
                        value={formData.role_name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.role_name && <span className="text-danger">{formErrors.role_name}</span>}
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Role Description"
                        type="text"
                        name="role_description"
                        value={formData.role_description}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.role_description && <span className="text-danger">{formErrors.role_description}</span>}
                  </FormGroup>
                  <div className="text-center">
                    <Button className="mr-2" color="danger" type="button" onClick={resetForm}>Clear</Button>
                    <Button className="mr-2" color="primary" type="submit">{isEdit ? 'Update' : 'Submit'}</Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md={7}>
            <div className="ag-theme-quartz" style={{ height: 500 }}>
              <Grid
                rowData={rowData}
                columnDefs={columnDefs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                idKey="role_id" // Correctly passing the identifier key
              />
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedRoleDetails}
        labelsMapping={labelsMapping} // Pass labelsMapping to ViewModal
      />
    </>
  );
};

export default Role;
