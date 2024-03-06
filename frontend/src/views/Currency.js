import React, { useState, useEffect } from "react";
import axios from "axios";
import CommonHeader from "../components/Headers/CommonHeader";
import Grid from "../components/Ag-grid/Grid";
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

const Currency = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCurrencyDetails, setSelectedCurrencyDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedCurrencyId, setEditedCurrencyId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    currency_name: "",
    currency_abbreviation: "",
  });

  const [formData, setFormData] = useState({
    currency_name: "",
    currency_abbreviation: "",
  });

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCurrencyDetails(null);
  };

  const labelsMapping = {
    currency_name: "Currency Name",
    currency_abbreviation: "Currency Abbreviation",
  };

  const handleEdit = async (currencyId) => {
    try {
      const response = await axios.get(`/currency/${currencyId}`);
      if (response.status === 200) {
        const currencyDetails = response.data.data;
        setFormData({
          currency_name: currencyDetails.currency_name,
          currency_abbreviation: currencyDetails.currency_abbreviation,
        });
        setIsEdit(true); // Set edit mode to true
        setEditedCurrencyId(currencyId);
      } else {
        toast.error("Failed to fetch currency details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching currency details");
    }
  };

  const handleDelete = async (currencyId) => {
    try {
      const response = await axios.delete(`/currency/${currencyId}`);
      if (response.status === 200) {
        toast.success("Currency deleted successfully");
        const updatedResponse = await axios.get("/currency");
        setRowData(updatedResponse.data.data);
      } else {
        toast.error("Failed to delete currency");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting currency");
    }
  };

  const handleView = async (currencyId) => {
    try {
      const response = await axios.get(`/currency/${currencyId}`);
      if (response.status === 200) {
        const currencyDetails = response.data.data;
        setSelectedCurrencyDetails(currencyDetails);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch currency details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching currency details");
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Currency Name",
      field: "currency_name",
      filter: true,
      sortable: true,
    },
    {
      headerName: "Currency Abbreviation",
      field: "currency_abbreviation",
      filter: true,
      sortable: true,
    },
  ]);

  const validateForm = () => {
    let errors = {};

    if (!formData.currency_name.trim()) {
      errors.currency_name = "Currency name is required";
    }

    if (!formData.currency_abbreviation.trim()) {
      errors.currency_abbreviation = "Currency abbreviation is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const fetchCurrencies = async () => {
    try {
      setError(false);
      const response = await axios.get("/currency");
      setRowData(response.data.data);
      return response;
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch currency data");
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const url = isEdit ? `/currency/${editedCurrencyId}` : "/currency";
      const method = isEdit ? "put" : "post";
      const response = await axios[method](url, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success(
          isEdit
            ? "Currency updated successfully"
            : "Currency added successfully"
        );
        const updatedResponse = await fetchCurrencies();
        setRowData(updatedResponse.data.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetForm();
      } else {
        toast.error("Failed to submit currency data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting currency data");
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
    setEditedCurrencyId(null);
    setIsViewModalOpen(false);
    setSelectedCurrencyDetails(null);
    setFormData({
      currency_name: "",
      currency_abbreviation: "",
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
                <h3 className="mb-0">{isEdit ? "Update" : "Add"} Currency</h3>
              </CardHeader>
              <CardBody>
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-money-coins" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Currency Name"
                        type="text"
                        name="currency_name"
                        value={formData.currency_name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.currency_name && (
                      <span className="text-danger">
                        {formErrors.currency_name}
                      </span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-money-bill" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Currency Abbreviation"
                        type="text"
                        name="currency_abbreviation"
                        value={formData.currency_abbreviation}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.currency_abbreviation && (
                      <span className="text-danger">
                        {formErrors.currency_abbreviation}
                      </span>
                    )}
                  </FormGroup>
                  <div className="text-center">
                    <Button
                      className="mr-2"
                      color="danger"
                      type="button"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>
                    <Button className="mr-2" color="primary" type="submit">
                      {isEdit ? "Update" : "Submit"}
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
                idKey="currency_Id"
              />
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedCurrencyDetails}
        labelsMapping={labelsMapping}
      />
    </>
  );
};

export default Currency;
