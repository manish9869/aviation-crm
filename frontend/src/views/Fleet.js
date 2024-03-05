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
  Col,
  Button,
  Input,
  Label,
  InputGroup,
  ModalFooter,
  CustomInput,
} from "reactstrap";
import Select from "react-select";
import Grid from "./../components/ag-grid/Grid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewModal from "components/Modal/Modal";
import YearPicker from "components/YearPicker/yearpicker";

const Fleet = () => {
  const [selectedYear, setSelectedYear] = useState(null);

  // ... (other code)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFleetDetails, setSelectedFleetDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedfleetId, setEditedfleetId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [fetchcurrency, setFetchCurrency] = useState([]);
  const [fetchcategory, setFetchCategory] = useState([]);
  const [fetchsellers, setFetchSellers] = useState([]);
  const [selectedSellerDDL, setSelectedSellerDDL] = useState({});

  const [formErrors, setFormErrors] = useState({
    tail_number: "",
    model: "",
    hour_price: "",
    knots_speed: "",
    max_range_nm: "",
    pax_number: "",
    brand: "",
    photo_interior: "",
    photo_exterior: "",
    yom: "",
    currency: null, // Selected currency
    category: null, // Selected user type
    seller: null, // Selected seller
  });

  const [formData, setFormData] = useState({
    tail_number: "",
    model: "",
    hour_price: 0,
    knots_speed: 0,
    max_range_nm: 0,
    pax_number: 0,
    brand: "",
    photo_interior: "",
    photo_exterior: "",
    yom: "",
    currency: null, // Selected currency
    category: null, // Selected user type
    seller: null, // Selected seller
  });

  /*#region AG GRID Handlers and Column Defination */

  const handleEdit = async (fleetId) => {
    console.log("fleetId", fleetId);
    // Fetch user details by ID and set form fields
    await fetchSellers();
    await fetchFleetDetails(fleetId);
    setIsEdit(true); // Set edit mode
    setEditedfleetId(fleetId); // Set the ID of the user being edited
  };

  const handleDelete = async (fleetId) => {
    try {
      console.log("Id: " + fleetId);
      const response = await axios.delete(`/fleet/${fleetId}`);

      if (response.status === 200) {
        // Assuming your API returns a success status code
        toast.success("Fleet deleted successfully");

        // After successfully deleting, fetch the latest data and update the grid
        const getResponse = await axios.get("/fleet");
        setRowData(getResponse.data.data);
        // const getResponse = await axios.get("/user");
        // setRowData(getResponse.data.data);
      } else {
        toast.error("Failed to delete Fleet");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting Fleet");
    }
  };

  const handleView = async (fleetId) => {
    try {
      const response = await axios.get(`/fleet/${fleetId}`);
      if (response.status === 200) {
        console.log("We are inside handle view");
        const fleetDetails = response.data.data;
        console.log("Fleet Details: " + JSON.stringify(fleetDetails));
        setSelectedFleetDetails(fleetDetails);
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
      headerName: "Tail Number",
      field: "tail_number",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Model",
      field: "model",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Hour Price",
      field: "hour_price",
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
      tail_number,
      model,
      hour_price,
      knots_speed,
      max_range_nm,
      pax_number,
      brand,
      photo_interior,
      photo_exterior,
      yom,
      currency,
      category,
      seller,
    } = formData;

    // console.log(max_range_nm, currency, category, seller);

    if (!tail_number.trim()) {
      errors.tail_number = "Tail Number is required";
      valid = false;
    }

    if (!model.trim()) {
      errors.model = "Model Name is required";
      valid = false;
    }

    if (!hour_price.trim()) {
      errors.hour_price = "Hour Price is required";
      valid = false;
    } else if (isNaN(hour_price.trim())) {
      errors.hour_price = "Hour Price is not a valid number";
      valid = false;
    }

    if (knots_speed === null) {
      errors.knots_speed = "Knot Speed is required";
      valid = false;
    }

    if (max_range_nm === null) {
      errors.max_range_nm = "Max Range is required";
      valid = false;
    }

    if (pax_number === null) {
      errors.max_range_nm = "Pax Number is required";
      valid = false;
    }

    if (!brand.trim()) {
      errors.max_range_nm = "Brand is required";
      valid = false;
    }

    if (!photo_interior.trim()) {
      errors.photo_interior = "Photo Interior is required";
      valid = false;
    }

    if (!photo_exterior.trim()) {
      errors.photo_exterior = "Photo Exterior is required";
      valid = false;
    }

    if (yom === null) {
      errors.yom = "Yom is required";
      valid = false;
    }

    if (!currency) {
      errors.currency = "Currency Type is required";
      valid = false;
    }

    if (!category) {
      errors.category = "User Type is required";
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

  const fetchCurrency = async () => {
    try {
      const response = await axios.get("/currency");

      setFetchCurrency(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch currency", error);
      return [];
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get("/category");
      // console.log("User Type: " + response.data.data);
      setFetchCategory(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch category", error);
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
    const fetchData = async () => {
      try {
        setError(false);

        // Fetch currencys, user types, and sellers
        const [currency, category, seller, fleetData] = await Promise.all([
          fetchCurrency(),
          fetchCategory(),
          fetchSellers(),
          axios.get("/fleet"),
        ]);

        setRowData(fleetData.data.data);
        // console.log("UserData=========> " + JSON.stringify(fleetData.data.data));

        // Update form data with fetched currencys, user types, and sellers
        setFormData((prevFormData) => ({
          ...prevFormData,
          currency,
          category,
          seller,
        }));

        resetForm();
        // console.log("Form Data " + JSON.stringify(formData));
      } catch (error) {
        setError(true);
        toast.error("Failed to fetch fleet data");
      }
    };

    fetchData();
  }, []);

  const fetchFleetDetails = async (fleetId) => {
    try {
      const response = await axios.get(`/fleet/${fleetId}`);

      if (response.status === 200) {
        const fleetDetails = response.data.data;

        console.log(fleetDetails);

        setSelectedSellerDDL({
          value: fleetDetails.seller.seller_id,
          label: fleetDetails.seller.seller_commercial_name,
        });

        console.log(selectedSellerDDL);

        // Set form fields with user details
        setFormData({
          tail_number: fleetDetails.tail_number,
          model: fleetDetails.model,
          hour_price: fleetDetails.hour_price,
          knots_speed: fleetDetails.knots_speed,
          max_range_nm: fleetDetails.max_range_nm,
          pax_number: fleetDetails.pax_number,
          brand: fleetDetails.brand,
          photo_interior: fleetDetails.photo_interior,
          photo_exterior: fleetDetails.photo_exterior,
          yom: fleetDetails.yom,
          currency: fleetDetails.currency
            ? fleetDetails.currency.currency_Id
            : null,
          category: fleetDetails.category
            ? fleetDetails.category.category_id
            : null,
          seller: fleetDetails.seller ? fleetDetails.seller.seller_id : null,
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
      yom: parseInt(formData.yom, 10),
      knots_speed: parseInt(formData.knots_speed, 10),
      max_range_nm: parseInt(formData.max_range_nm, 10),
      pax_number: parseInt(formData.pax_number, 10),
    };

    // console.log("Form Data after submitting " + formDataWithNumber);
    const url = isEdit ? `/fleet/${editedfleetId}` : "/fleet";
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
          const getResponse = await axios.get("/fleet");
          setRowData(getResponse.data.data);

          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Reset form and edit mode after submission
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(isEdit ? "Failed to update Fleet" : "Failed to add Fleet");
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

  const handleYearChange = (date) => {
    if (date !== null) {
      const year = date.getFullYear();
      setSelectedYear(year);

      setFormData((prevFormData) => ({
        ...prevFormData,
        yom: year.toString(),
      }));
    } else {
      let valid = true;
      const errors = {};
      errors.yom = "Year of Manufacture is required";
      valid = false;
      setFormErrors(errors);
      return valid;
    }
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditedfleetId(null);
    setIsViewModalOpen(false);
    setSelectedFleetDetails(null);
    setFormData({
      tail_number: "",
      model: "",
      hour_price: "",
      knots_speed: "",
      max_range_nm: "",
      paxnumber: "",
      photo_interior: "",
      photo_exterior: "",
      brand: "",
      yom: "",
      currency: null, // Selected currency
      category: null, // Selected user type
      seller: null, // Selected seller
    });
    setFormErrors({});
  };

  /*#endregion BUTTON CLICKS */

  /*#region MODAL CLOSE */

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFleetDetails(null);
  };

  const labelsMapping = {
    fleet_id: "Fleet Id",
    tail_number: "Tail Number",
    model: "Model",
    hour_price: "Hour Price",
    knots_speed: "Knots Speed",
    pax_number: "Pax Number",
    brand: "Brand",
    photo_interior: "Photo Interior",
    photo_exterior: "Photo Exterior",
    yom: "Year of Manufacture",
    date_time_insert: "Inserted Date",
    currency: "Currency",
    // currency.currency_name: "Role Name",
    category: "Category",
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
                <h3 className="mb-0">{isEdit ? "Edit Fleet" : "Add Fleet"}</h3>
              </CardHeader>
              <CardBody>
                <Form currency="form">
                  <FormGroup>
                    <Label for="tail_number">Tail Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="tail_number"
                        name="tail_number"
                        value={formData.tail_number}
                        placeholder="Tail Number"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.tail_number && (
                      <small className="text-danger">
                        {formErrors.tail_number}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="model">Model</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        placeholder="Model"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.model && (
                      <small className="text-danger">{formErrors.model}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="hour_price">Hour Price</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="hour_price"
                        name="hour_price"
                        value={formData.hour_price}
                        placeholder="Hour Price"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.hour_price && (
                      <small className="text-danger">
                        {formErrors.hour_price}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="knots_speed">Knots Speed</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="id_number"
                        name="knots_speed"
                        value={formData.knots_speed}
                        placeholder="Knots Speed"
                        type="number"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.knots_speed && (
                      <small className="text-danger">
                        {formErrors.knots_speed}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="max_range_nm">Max Range</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="max_range_nm"
                        name="max_range_nm"
                        value={formData.max_range_nm}
                        placeholder="Max Range"
                        type="number"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.max_range_nm && (
                      <small className="text-danger">
                        {formErrors.max_range_nm}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="pax_number">Pax Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="pax_number"
                        name="pax_number"
                        value={formData.pax_number}
                        placeholder="Pax Number"
                        type="number"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.pax_number && (
                      <small className="text-danger">
                        {formErrors.pax_number}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="brand">Brand</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        placeholder="Brand"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.brand && (
                      <small className="text-danger">{formErrors.brand}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="photo_interior">Photo Interior</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="photo_interior"
                        name="photo_interior"
                        value={formData.photo_interior}
                        placeholder="Photo Interior"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.photo_interior && (
                      <small className="text-danger">
                        {formErrors.photo_interior}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="photo_exterior">Photo Exterior</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="photo_exterior"
                        name="photo_exterior"
                        value={formData.photo_exterior}
                        placeholder="Photo Exterior"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.photo_exterior && (
                      <small className="text-danger">
                        {formErrors.photo_exterior}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="yom">Year Of Manufacture</Label>
                    <Row>
                      <Col>
                        <YearPicker
                          selected={selectedYear}
                          onChange={handleYearChange}
                          value={formData.yom}
                        />
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup>
                    <Label for="currency">Currency</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      {fetchcurrency && fetchcurrency.length > 0 ? (
                        <Input
                          type="select"
                          name="currency"
                          id="currency"
                          onChange={handleChange}
                          value={formData.currency || ""}
                        >
                          <option key="" value="">
                            Select Currency
                          </option>
                          {fetchcurrency.map((currency) => (
                            <option
                              key={currency.currency_Id}
                              value={currency.currency_Id}
                            >
                              {currency.currency_name}
                            </option>
                          ))}
                        </Input>
                      ) : (
                        <div>No currencys available</div>
                      )}
                    </InputGroup>
                    {formErrors.currency && (
                      <small className="text-danger">
                        {formErrors.currency}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="category">Category</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      {fetchcategory && fetchcategory.length > 0 ? (
                        <Input
                          type="select"
                          name="category"
                          id="category"
                          onChange={handleChange}
                          value={formData.category || ""}
                        >
                          <option value="">Select Category</option>
                          {fetchcategory.map((category) => (
                            <option
                              key={category.category_id}
                              value={category.category_id}
                            >
                              {category.category_name}
                            </option>
                          ))}
                        </Input>
                      ) : (
                        <div>No user types available</div>
                      )}
                    </InputGroup>
                    {formErrors.category && (
                      <small className="text-danger">
                        {formErrors.category}
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
                        setIsEdit(false); // Reset edit mode
                        setEditedfleetId(null); // Reset edited user ID
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
                idKey="fleet_id" // or "user_id" depending on your use case
              />
            </div>
          </div>
          <ToastContainer />
        </Row>
      </Container>

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedFleetDetails}
        labelsMapping={labelsMapping}
      />
    </>
  );
};

export default Fleet;
