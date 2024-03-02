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
} from "reactstrap";
import Grid from "./../components/ag-grid/Grid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewModal from "components/Modal/Modal";
import Dropzone from "components/Dropzone/Dropzone";

const Seller = () => {
  const [resetLegalDropzone, setResetLegalDropzone] = useState(false);
  const [resetAocDropzone, setResetAocDropzone] = useState(false);
  const [legalFiles, setLegalFiles] = useState([]);
  const [aocFiles, setAocFiles] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSellerDetails, setSelectedSellerDetails] = useState(null);
  const [error, setError] = useState(false);
  const [editedSellerId, setEditedSellerId] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formErrors, setFormErrors] = useState({
    seller_commercial_name: "",
    seller_legal_name: "",
    address: "",
    tax_identification_number: "",
    contact_email: "",
    contact_name: "",
    contact_phone_number: "",
    aoc_file: "",
    legal_notary_file: "",
    enable: "",
  });

  const [formData, setFormData] = useState({
    seller_commercial_name: "",
    seller_legal_name: "",
    address: "",
    tax_identification_number: "",
    contact_email: "",
    contact_name: "",
    contact_phone_number: "",
    aoc_file: [],
    legal_notary_file: [],
    enable: 0,
  });

  const handleAocFilesUploaded = (uploadedFiles) => {
    setAocFiles(uploadedFiles);
  };

  const handleLegalFilesUploaded = (uploadedFiles) => {
    setLegalFiles(uploadedFiles);
  };

  /*#region AG GRID Handlers and Column Defination */

  const handleEdit = (sellerId) => {
    // Fetch seller details by ID and set form fields
    fetchSellerDetails(sellerId);
    setIsEdit(true); // Set edit mode
    setEditedSellerId(sellerId); // Set the ID of the seller being edited
  };

  const handleDelete = async (sellerId) => {
    try {
      const response = await axios.delete(`/sellers/${sellerId}`);

      if (response.status === 200) {
        // Assuming your API returns a success status code
        toast.success("Seller deleted successfully");

        // After successfully deleting, fetch the latest data and update the grid
        const getResponse = await axios.get("/seller");
        setRowData(getResponse.data.data);
        // const getResponse = await axios.get("/seller");
        // setRowData(getResponse.data.data);
      } else {
        toast.error("Failed to delete Seller");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting Seller");
    }
  };

  const handleView = async (sellerId) => {
    try {
      const response = await axios.get(`/sellers/${sellerId}`);
      if (response.status === 200) {
        const sellerDetails = response.data.data;
        setSelectedSellerDetails(sellerDetails);
        setIsViewModalOpen(true);
      } else {
        toast.error("Failed to fetch seller details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching seller details");
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Commerical Name",
      field: "seller_commercial_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Contact Name",
      field: "contact_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Contact Email",
      field: "contact_email",
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
      seller_commercial_name,
      seller_legal_name,
      address,
      tax_identification_number,
      contact_email,
      contact_name,
    } = formData;

    if (!seller_commercial_name.trim()) {
      errors.seller_commercial_name = "Commercial Name is required";
      valid = false;
    }

    if (!seller_legal_name.trim()) {
      errors.seller_legal_name = "Legal Name is required";
      valid = false;
    }

    if (!address.trim()) {
      errors.address = "Address is required";
      valid = false;
    }

    if (!tax_identification_number.trim()) {
      errors.tax_identification_number =
        "Tax Identification Number is required";
      valid = false;
    }

    if (!contact_email.trim()) {
      errors.contact_email = "Contact Email is required";
      valid = false;
    }

    if (!contact_name.trim()) {
      errors.contact_name = "Contact Name is required";
      valid = false;
    }

    // Set form errors state
    setFormErrors(errors);

    return valid;
  };

  /*#endregion Validation FORM */

  /*#region API CALLS */

  useEffect(() => {
    (async () => {
      await fetchAllSeller();
    })();
  }, []);

  const fetchSellerDetails = async (sellerId) => {
    try {
      const response = await axios.get(`/sellers/${sellerId}`);

      if (response.status === 200) {
        const sellerDetails = response.data.data;

        // Set form fields with seller details
        setFormData({
          seller_commercial_name: sellerDetails.seller_commercial_name,
          seller_legal_name: sellerDetails.seller_legal_name,
          address: sellerDetails.address,
          tax_identification_number: sellerDetails.tax_identification_number,
          contact_email: sellerDetails.contact_email,
          contact_name: sellerDetails.contact_name,
          contact_phone_number: sellerDetails.contact_phone_number,
          aoc_file: sellerDetails.aoc_file,
          legal_notary_file: sellerDetails.legal_notary_file,
          enable: sellerDetails.enable,
        });
      } else {
        toast.error("Failed to fetch seller details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching seller details");
    }
  };

  const fetchAllSeller = async () => {
    try {
      setError(false);
      const response = await axios.get("/sellers");
      setRowData(response.data.data);
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch seller data");
    }
  };

  const uploadAocMedia = async () => {
    if (!aocFiles?.length) return;

    setResetAocDropzone(false);

    try {
      const response = await uploadApiCall(aocFiles);

      // Reset Dropzone after submitting
      setAocFiles([]);
      setResetAocDropzone(true);

      return response;
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };

  const uploadLegalMedia = async () => {
    if (!legalFiles?.length) return;

    setResetLegalDropzone(false);

    try {
      const response = await uploadApiCall(legalFiles);

      // Reset Dropzone after submitting
      setLegalFiles([]);
      setResetLegalDropzone(true);

      return response;
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    }
  };

  const uploadApiCall = async (filesdata) => {
    try {
      const formData = new FormData();
      filesdata.forEach((file) => formData.append("file", file));

      const response = await axios.post("/media/upload", formData);

      return response.data.data;
    } catch (error) {}
  };

  const addUpdateSeller = async (aocFileArray = [], legalFileArray = []) => {
    let updatedFomData = {};

    updatedFomData = {
      ...formData,
      enable: parseInt(formData.enable, 10),
      aoc_file: aocFileArray,
      legal_notary_file: legalFileArray,
    };

    const url = isEdit ? `/sellers/${editedSellerId}` : "/sellers";
    console.log("formDataWithNumber====>", updatedFomData);
    await axios
      .request({
        url,
        method: isEdit ? "put" : "post",
        data: updatedFomData,
      })
      .then(async (result) => {
        console.log("result======>", result);
        if (result) {
          toast.success(isEdit ? "Updated Successfully" : "Added Successfully");
          await fetchAllSeller();

          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Reset form and edit mode after submission
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          isEdit ? "Failed to update Seller" : "Failed to add Seller"
        );
      });
  };

  /*#endregion API CALLS */

  /*#region BUTTON CLICKS */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const aocFileArray = await uploadAocMedia();

    console.log("aocFileArray=====>", aocFileArray);

    const legalFileArray = await uploadLegalMedia();

    console.log("legalFileArray=====>", legalFileArray);
    await addUpdateSeller(aocFileArray, legalFileArray);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditedSellerId(null);
    setIsViewModalOpen(false);
    setSelectedSellerDetails(null);

    setFormData({
      seller_commercial_name: "",
      seller_legal_name: "",
      address: "",
      tax_identification_number: "",
      contact_email: "",
      contact_name: "",
      contact_phone_number: "",
      aoc_file: "",
      legal_notary_file: "",
      enable: 0,
    });
    setFormErrors({});
  };

  /*#endregion BUTTON CLICKS */

  /*#region MODAL CLOSE */

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedSellerDetails(null);
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
                  {isEdit ? "Edit Seller" : "Add Seller"}
                </h3>
              </CardHeader>
              <CardBody>
                <Form role="form">
                  <FormGroup>
                    <Label for="seller_commercial_name">
                      Seller Commercial Name
                    </Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="seller_commercial_name"
                        name="seller_commercial_name"
                        value={formData.seller_commercial_name}
                        placeholder="Seller Commercial Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.seller_commercial_name && (
                      <small className="text-danger">
                        {formErrors.seller_commercial_name}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="seller_legal_name">Seller Legal Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="seller_legal_name"
                        name="seller_legal_name"
                        value={formData.seller_legal_name}
                        placeholder="Seller Legal Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        placeholder="Address"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="id_number">Tax Identification Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="id_number"
                        name="tax_identification_number"
                        value={formData.tax_identification_number}
                        placeholder="Tax Identification Number"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactemail">Contact Email</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactemail"
                        name="contact_email"
                        value={formData.contact_email}
                        placeholder="Contact Email"
                        type="email"
                        autoComplete="new-email"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactname">Contact Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactname"
                        name="contact_name"
                        value={formData.contact_name}
                        placeholder="Contact Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactPhoneNumber">Contact Phone Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactPhoneNumber"
                        name="contact_phone_number"
                        value={formData.contact_phone_number}
                        placeholder="Contact Phone Number"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="aoc_file">AOC File</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      {/* <Input
                        id="aoc_file"
                        name="aoc_file"
                        value={formData.aoc_file}
                        placeholder="AOC File"
                        type="text"
                        onChange={handleChange}
                      /> */}

                      <Dropzone
                        onFilesUploaded={handleAocFilesUploaded}
                        resetFiles={resetAocDropzone}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="legal_notary_file">Legal Notary File</Label>
                    <InputGroup className="input-group-alternative">
                      {/* <Input
                        id="legal_notary_file"
                        name="legal_notary_file"
                        value={formData.legal_notary_file}
                        placeholder="Legal Notary File"
                        type="text"
                        onChange={handleChange}
                      /> */}

                      <Dropzone
                        onFilesUploaded={handleLegalFilesUploaded}
                        resetFiles={resetLegalDropzone}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
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
                  </FormGroup>
                  <div className="text-center">
                    <Button
                      className="mt-4"
                      color="danger"
                      type="reset"
                      onClick={() => {
                        resetForm();
                        setIsEdit(false); // Reset edit mode
                        setEditedSellerId(null); // Reset edited seller ID
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
              />
            </div>
          </div>
          <ToastContainer />
        </Row>
      </Container>

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        data={selectedSellerDetails}
      />
    </>
  );
};

export default Seller;
