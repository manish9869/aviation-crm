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

const Category = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    category_name: "",
  });

  const [formData, setFormData] = useState({
    category_name: "",
  });

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCategoryDetails(null);
  };

  const labelsMapping = {
    category_name: "Category Name",
  };

  const handleEdit = async (categoryId) => {
    try {
      const response = await axios.get(`/category/${categoryId}`);
      if (response.status === 200) {
        const categoryDetails = response.data.data;
        setFormData({
          category_name: categoryDetails.category_name,
        });
        setIsEdit(true);
        setEditedCategoryId(categoryId);
      } else {
        toast.error("Failed to fetch category details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching category details");
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(`/category/${categoryId}`);
      if (response.status === 200) {
        toast.success("Category deleted successfully");
        const updatedResponse = await axios.get("/category");
        setRowData(updatedResponse.data.data);
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting category");
    }
  };

  const handleView = async (categoryId) => {
    try {
      const response = await axios.get(`/category/${categoryId}`);
      if (response.status === 200) {
        const categoryDetails = response.data.data;
        setSelectedCategoryDetails(categoryDetails);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch category details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching category details");
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Category Name",
      field: "category_name",
      filter: true,
      sortable: true,
    },
  ]);

  const validateForm = () => {
    let errors = {};

    if (!formData.category_name.trim()) {
      errors.category_name = "Category name is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const fetchCategories = async () => {
    try {
      setError(false);
      const response = await axios.get("/category");
      setRowData(response.data.data);
      return response;
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch category data");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const url = isEdit ? `/category/${editedCategoryId}` : "/category";
      const method = isEdit ? "put" : "post";
      const response = await axios[method](url, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success(isEdit ? "Category updated successfully" : "Category added successfully");
        const updatedResponse = await fetchCategories();
        setRowData(updatedResponse.data.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetForm();
      } else {
        toast.error("Failed to submit category data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting category data");
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
    setEditedCategoryId(null);
    setIsViewModalOpen(false);
    setSelectedCategoryDetails(null);
    setFormData({
      category_name: "",
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
                <h3 className="mb-0">{isEdit ? 'Edit Category' : 'Add Category'}</h3>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-folder-17" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Category Name"
                        type="text"
                        name="category_name"
                        value={formData.category_name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.category_name && <span className="text-danger">{formErrors.category_name}</span>}
                  </FormGroup>
                  <div className="text-center">
                    <Button className="mr-2" color="danger" type="button" onClick={resetForm}>Clear</Button>
                    <Button className="mr-2" color="primary" type="submit">
                      {isEdit ? 'Update' : 'Submit'}
                    </Button>
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
                idKey="category_id" 
              />
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedCategoryDetails}
        labelsMapping={labelsMapping}
      />
    </>
  );
};

export default Category;
