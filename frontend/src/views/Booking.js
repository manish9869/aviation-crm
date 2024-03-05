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
import Airport from "./airport";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const Booking = () => {
  const [selectedYear, setSelectedYear] = useState(null);

  // ... (other code)

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFleetDetails, setSelectedFleetDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedfleetId, setEditedfleetId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [fetchcurrency, setFetchCurrency] = useState([]);
  const [fetchairport, setFetchAirport] = useState([]);
  const [fetchfleets, setFetchFleets] = useState([]);
  const [selectedFleetDDL, setSelectedFleetDDL] = useState({});
  const [selectedAirportDDL, setSelectedAirportDDL] = useState({});
  const [selectedDestinationAirportDDL, setSelectedDestinationAirportDDL] =
    useState({});
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [showAdditionalDestinationForm, setShowAdditionalDestinationForm] =
    useState(false);

  const handleAirportChange = (selectedAirport) => {
    if (!selectedAirport) {
      // If airport is cleared, clear fbo_name
      setFormData((prevFormData) => ({
        ...prevFormData,
        airport_source: null,
        fbo_source: "",
      }));
      // Hide additional form elements
      setShowAdditionalForm(false);
      return;
    }

    // You can perform additional logic based on the selected airport if needed
    setFormData((prevFormData) => ({
      ...prevFormData,
      airport_source: selectedAirport.value,
    }));

    // Show the additional form elements when an airport is selected
    setShowAdditionalForm(true);
  };

  const handleDestinationAirportChange = (selectedDestinationAirport) => {
    if (!selectedDestinationAirport) {
      // If destination airport is cleared, clear destination FBO name
      setFormData((prevFormData) => ({
        ...prevFormData,
        airport_destination: null,
        fbo_destination: "",
      }));
      // Hide additional form elements
      setShowAdditionalDestinationForm(false);
      return;
    }

    // You can perform additional logic based on the selected destination airport if needed
    setFormData((prevFormData) => ({
      ...prevFormData,
      airport_destination: selectedDestinationAirport.value,
    }));

    // Show the additional form elements when a destination airport is selected
    setShowAdditionalDestinationForm(true);
  };

  // const handleFboNameChange = (selectedFboName) => {
  //   // You can perform additional logic based on the selected FBO name if needed
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     fbo_name: selectedFboName ? selectedFboName.value : null,
  //   }));
  // };

  const handleDestinationFboNameChange = (selectedDestinationFboName) => {
    // You can perform additional logic based on the selected destination FBO name if needed
    setFormData((prevFormData) => ({
      ...prevFormData,
      fbo_destination: selectedDestinationFboName
        ? selectedDestinationFboName.value
        : null,
    }));
  };

  const [formErrors, setFormErrors] = useState({
    initial_date: "",
    initial_time: "",
    departure_date: "",
    departure_time: "",
    numpax: 0,
    price_full_aircraft: "",
    price_per_seat: "",
    app_amenities_detail: "",
    airport_source: null,
    fbo_source: "",
    airport_destination: null,
    fbo_destination: "",
    currency: null, // Selected currency
    fleet: null, // Selected fleet
  });

  const [formData, setFormData] = useState({
    initial_date: "",
    initial_time: "",
    departure_date: "",
    departure_time: "",
    numpax: 0,
    price_full_aircraft: "",
    price_per_seat: "",
    app_amenities_detail: "",
    airport_source: null,
    fbo_source: "",
    airport_destination: null,
    fbo_destination: "",
    currency: null, // Selected currency
    fleet: null, // Selected fleet
  });

  /*#region AG GRID Handlers and Column Defination */

  const handleEdit = async (fleetId) => {
    console.log("fleetId", fleetId);
    // Fetch user details by ID and set form fields
    await fetchFleets();
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
      field: "initial_date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Hour Price",
      field: "initial_time",
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
      initial_date,
      initial_time,
      departure_date,
      departure_time,
      numpax,
      price_full_aircraft,
      price_per_seat,
      app_amenities_detail,
      airport_source,
      fbo_source,
      airport_destination,
      fbo_destination,
      currency, // Selected currency
      fleet, // Selected fleet
    } = formData;

    // console.log(departure_time, currency, airport, fleet);

    if (!initial_date) {
      errors.initial_date = "Initial Date is required";
      valid = false;
    }

    if (!initial_time) {
      errors.initial_time = "Initial Time is required";
      valid = false;
    }

    if (departure_date === null) {
      errors.departure_date = "Departure Date is required";
      valid = false;
    }

    if (departure_time === null) {
      errors.departure_time = "Departure Time is required";
      valid = false;
    }

    if (numpax === null) {
      errors.numberOfPassengers = "Number of Passengers is required";
      valid = false;
    }

    if (!price_full_aircraft.trim()) {
      errors.price_full_aircraft = "Aircraft Full Price is required";
      valid = false;
    }

    if (!price_per_seat.trim()) {
      errors.price_per_seat = "Price Per Seat is required";
      valid = false;
    }

    if (!app_amenities_detail.trim()) {
      errors.app_amenities_detail = "Ammenities Details is required";
      valid = false;
    }

    if (!currency) {
      errors.currency = "Currency Type is required";
      valid = false;
    }

    if (!fleet) {
      errors.fleet = "Fleet is required";
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

  const fetchAirports = async (value) => {
    try {
      const response = await axios.get(
        "/airport?page=1&pageSize=10&searchterm=" + value
      );
      // console.log("User Type: " + response.data.data);
      const airportOptions = response.data.data.data.map((airport) => ({
        value: airport.airport_id,
        label: airport.airportname + " | " + airport.airporticaocode,
      }));
      setFetchAirport(airportOptions);
      return response.data.data.data;
    } catch (error) {
      console.error("Failed to fetch airport", error);
      return [];
    }
  };

  // const fetchAirports = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3232/api/aviation-service-dev/airport?pageSize=-1"
  //     );

  //     if (response.status === 200) {
  //       const airportsData = response.data.data;
  //       setFetchAirport(airportsData);
  //             return response.data.data;
  //     } else {
  //       console.error("Failed to fetch airports data:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("An error occurred while fetching airports data:", error);
  //   }
  // };

  const fetchFleets = async () => {
    try {
      const response = await axios.get("/fleet");

      const fleetsOptions = response.data.data.map((fleet) => ({
        value: fleet.fleet_id,
        label: fleet.tail_number,
      }));

      // Set the state with the options
      setFetchFleets(fleetsOptions);

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch fleets", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);

        // Fetch currencys, user types, and fleets
        const [currency, airport, fleet, airportemptyleg] =
          await Promise.all([
            fetchCurrency(),
            // fetchCategory(),
            fetchAirports(),
            fetchFleets(),
            // axios.get("/emptyleg"),
            axios.get("/airportemptylegcontrol"),
          ]);

        setRowData(airportemptyleg.data.data);
        // console.log("UserData=========> " + JSON.stringify(fleetData.data.data));

        // Update form data with fetched currencys, user types, and fleets
        setFormData((prevFormData) => ({
          ...prevFormData,
          currency,
          airport,
          fleet,
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

        setSelectedFleetDDL({
          value: fleetDetails.fleet.fleet_id,
          label: fleetDetails.fleet.fleet_commercial_name,
        });

        console.log(selectedFleetDDL);

        // Set form fields with user details
        setFormData({
          tail_number: fleetDetails.tail_number,
          initial_date: fleetDetails.initial_date,
          initial_time: fleetDetails.initial_time,
          departure_date: fleetDetails.departure_date,
          departure_time: fleetDetails.departure_time,
          numpax: fleetDetails.numpax,
          price_full_aircraft: fleetDetails.price_full_aircraft,
          price_per_seat: fleetDetails.price_per_seat,
          app_amenities_detail: fleetDetails.app_amenities_detail,
          fbo_name: fleetDetails.fbo_name,
          currency: fleetDetails.currency
            ? fleetDetails.currency.currency_Id
            : null,
          airport: fleetDetails.airport
            ? fleetDetails.airport.airport_id
            : null,
          fleet: fleetDetails.fleet ? fleetDetails.fleet.fleet_id : null,
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
      // fbo_name: parseInt(formData.fbo_name, 10),
      // departure_date: parseInt(formData.departure_date, 10),
      // departure_time: parseInt(formData.departure_time, 10),
      numpax: parseInt(formData.numpax, 10),
    };

    // console.log("Form Data after submitting " + formDataWithNumber);
    const url = isEdit ? `/fleet/${editedfleetId}` : "/emptyleg/booking";
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
      setSelectedAirportDDL({ value: -1, label: "Select Airport" });
      setSelectedDestinationAirportDDL({
        value: -1,
        label: "Select Destination Airport",
      });
      setSelectedFleetDDL({ value: -1, label: "Select Fleet" });
      setFormData((prevFormData) => ({
        ...prevFormData,
        fleet: null,
        airport: null,
      }));
      return;
    }
    let name = null;
    let value = null;
    if (e.hasOwnProperty("label")) {
      name = "fleet";
      value = e.value;
      setSelectedFleetDDL({ value: value, label: e.label });
      setSelectedAirportDDL({ value: value, label: e.label });
      setSelectedDestinationAirportDDL({ value: value, label: e.label });
    } else {
      name = e.target.name;
      value = e.target.value;
    }
    console.log("we are in Handle change for " + name + " : " + value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    console.log("selectedFleetDDL===>", selectedFleetDDL);
  };

  // const handleYearChange = (date) => {
  //   if (date !== null) {
  //     const year = date.getFullYear();
  //     setSelectedYear(year);

  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       fbo_name: year.toString(),
  //     }));
  //   } else {
  //     let valid = true;
  //     const errors = {};
  //     errors.fbo_name = "Year of Manufacture is required";
  //     valid = false;
  //     setFormErrors(errors);
  //     return valid;
  //   }
  // };

  const handleDateTimeChange = (date, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: date,
    }));
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditedfleetId(null);
    setIsViewModalOpen(false);
    setSelectedFleetDetails(null);
    setFormData({
      initial_date: "",
      initial_time: "",
      departure_date: "",
      departure_time: "",
      numpax: 0,
      price_full_aircraft: "",
      price_per_seat: "",
      app_amenities_detail: "",
      airport_source: null,
      fbo_source: "",
      airport_destination: null,
      fbo_destination: "",
      currency: null, // Selected currency
      fleet: null, // Selected fleet
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
    initial_date: "Model",
    initial_time: "Hour Price",
    departure_date: "Knots Speed",
    numpax: "Pax Number",
    price_full_aircraft: "Brand",
    price_per_seat: "Photo Interior",
    app_amenities_detail: "Photo Exterior",
    fbo_name: "Year of Manufacture",
    date_time_insert: "Inserted Date",
    currency: "Currency",
    // currency.currency_name: "Role Name",
    airport: "Category",
    fleet: "Fleet",
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
                <h3 className="mb-0">
                  {isEdit ? "Edit Booking" : "Add Booking"}
                </h3>
              </CardHeader>
              <CardBody>
                <Form currency="form">
                  <h3 className="mb-0">
                    {isEdit ? "Edit Fleet" : "Add Fleet"}
                  </h3>
                  <br></br>
                  <FormGroup>
                    <Label for="fleet">Fleet</Label>
                    {fetchfleets && fetchfleets.length > 0 ? (
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="ddlFleet"
                        value={fetchfleets.find(
                          (obj) => obj.value === selectedFleetDDL.value
                        )}
                        onChange={handleChange}
                        options={fetchfleets}
                      />
                    ) : (
                      <div>No fleets available</div>
                    )}
                    {formErrors.fleet && (
                      <small className="text-danger">{formErrors.fleet}</small>
                    )}
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
                    <Label for="initial_date">Initial Date</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <DatePicker
                        id="initial_date"
                        name="initial_date"
                        selected={formData.initial_date}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select Initial Date"
                        onChange={(date) =>
                          handleDateTimeChange(date, "initial_date")
                        }
                        className="form-control"
                      />
                    </InputGroup>
                    {formErrors.initial_date && (
                      <small className="text-danger">
                        {formErrors.initial_date}
                      </small>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="initial_time">Initial Time</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <TimePicker
                        id="initial_time"
                        name="initial_time"
                        value={formData.initial_time}
                        format="hh:mm:ss"
                        onChange={(time) =>
                          handleDateTimeChange(time, "initial_time")
                        }
                        className="form-control"
                        clearIcon={null} // Remove the clear icon if not needed
                      />
                    </InputGroup>
                    {formErrors.initial_time && (
                      <small className="text-danger">
                        {formErrors.initial_time}
                      </small>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label for="departure_date">Departure Date</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <DatePicker
                        id="departure_date"
                        name="departure_date"
                        selected={formData.departure_date}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select Departure Date"
                        onChange={(date) =>
                          handleDateTimeChange(date, "departure_date")
                        }
                        className="form-control"
                      />
                    </InputGroup>
                    {formErrors.departure_date && (
                      <small className="text-danger">
                        {formErrors.departure_date}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="departure_time">Departure Time</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <TimePicker
                        id="departure_time"
                        name="departure_time"
                        value={formData.departure_time}
                        format="hh:mm:ss"
                        onChange={(time) =>
                          handleDateTimeChange(time, "departure_time")
                        }
                        className="form-control"
                        clearIcon={null} // Remove the clear icon if not needed
                      />
                    </InputGroup>
                    {formErrors.departure_time && (
                      <small className="text-danger">
                        {formErrors.departure_time}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="numpax">Number Of Passengers</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="numpax"
                        name="numpax"
                        value={formData.numpax}
                        placeholder="Pax Number"
                        type="number"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.numpax && (
                      <small className="text-danger">{formErrors.numpax}</small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="price_full_aircraft">Aircraft Full Price</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="price_full_aircraft"
                        name="price_full_aircraft"
                        value={formData.price_full_aircraft}
                        placeholder="Aircraft Full Price"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.price_full_aircraft && (
                      <small className="text-danger">
                        {formErrors.price_full_aircraft}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="price_per_seat">Price Per Seat</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="price_per_seat"
                        name="price_per_seat"
                        value={formData.price_per_seat}
                        placeholder="Price Per Seat"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.price_per_seat && (
                      <small className="text-danger">
                        {formErrors.price_per_seat}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="app_amenities_detail">Ammenities Details</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="app_amenities_detail"
                        name="app_amenities_detail"
                        value={formData.app_amenities_detail}
                        placeholder="Ammenities"
                        type="textarea" // Use type="textarea" for a multiline input
                        rows={4} // Adjust the number of rows as needed
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.app_amenities_detail && (
                      <small className="text-danger">
                        {formErrors.app_amenities_detail}
                      </small>
                    )}
                  </FormGroup>

                  <br></br>
                  <h3 className="mb-0">
                    {isEdit ? "Edit Flight" : "Add Flight"}
                  </h3>
                  <br></br>
                  <FormGroup>
                    <Label for="airport">Origin Airport</Label>
                    {fetchairport && fetchairport.length > 0 ? (
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="ddlAirport"
                        value={fetchairport.find(
                          (obj) => obj.value === selectedAirportDDL.value
                        )}
                        onChange={handleAirportChange}
                        options={fetchairport}
                      />
                    ) : (
                      <div>No airports available</div>
                    )}
                    {formErrors.airport && (
                      <small className="text-danger">
                        {formErrors.airport}
                      </small>
                    )}
                  </FormGroup>

                  {showAdditionalForm && (
                    <>
                      {/* Additional form elements for FBO Name */}
                      <FormGroup>
                        <Label for="fbo_source">Source FBO Name</Label>
                        <InputGroup className="input-group-alternative mb-3">
                          <Input
                            id="fbo_source"
                            name="fbo_source"
                            value={formData.fbo_source}
                            placeholder="FBO Name"
                            type="text"
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {formErrors.fbo_source && (
                          <small className="text-danger">
                            {formErrors.fbo_source}
                          </small>
                        )}
                      </FormGroup>

                      {/* Additional form elements for Source */}
                    </>
                  )}

                  <FormGroup>
                    <Label for="destination_airport">Destination Airport</Label>
                    {fetchairport && fetchairport.length > 0 ? (
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        name="ddlDestinationAirport"
                        value={fetchairport.find(
                          (obj) =>
                            obj.value === selectedDestinationAirportDDL.value
                        )}
                        onChange={handleDestinationAirportChange}
                        options={fetchairport}
                      />
                    ) : (
                      <div>No airports available</div>
                    )}
                    {formErrors.destination_airport && (
                      <small className="text-danger">
                        {formErrors.destination_airport}
                      </small>
                    )}
                  </FormGroup>

                  {showAdditionalDestinationForm && (
                    <>
                      {/* Additional form elements for Destination FBO Name */}
                      <FormGroup>
                        <Label for="fbo_destination">
                          Destination FBO Name
                        </Label>
                        <InputGroup className="input-group-alternative mb-3">
                          <Input
                            id="fbo_destination"
                            name="fbo_destination"
                            value={formData.fbo_destination}
                            placeholder="Destination FBO Name"
                            type="text"
                            onChange={handleChange}
                          />
                        </InputGroup>
                        {formErrors.fbo_destination && (
                          <small className="text-danger">
                            {formErrors.fbo_destination}
                          </small>
                        )}
                      </FormGroup>
                    </>
                  )}

                  {/* Fleet dropdown */}

                  <div className="text-center">
                    <Button
                      className="mt-4"
                      color="danger"
                      type="reset"
                      onClick={() => {
                        resetForm();
                        setIsEdit(false); // Reset edit mode
                        setEditedfleetId(null); // Reset edited user ID
                        // Clear the fleet value in formData
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          fleet: null,
                          airport: null,
                        }));
                        setShowAdditionalForm(false);
                        setShowAdditionalDestinationForm(false);
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

export default Booking;
