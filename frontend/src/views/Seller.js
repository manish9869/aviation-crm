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
import Grid from "./../components/ag-grid/Grid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewModal from "components/Modal/Modal";
import Dropzone from "components/Dropzone/Dropzone";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "./../helper/axios";
import "./../components/Dropzone/dropzone.css";
const Seller = () => {
  const [isMediaDelete, setisMediaDelete] = useState(false);
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
    aoc_file: [],
    legal_notary_file: [],
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

  const handleEdit = async (sellerId) => {
    // Fetch seller details by ID and set form fields
    resetForm();
    await fetchSellerDetails(sellerId);
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
        const getResponse = await fetchAllSeller();
        setRowData(getResponse.data.data);
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
      contact_phone_number,
      aoc_file,
      legal_notary_file,
      enable,
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
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact_email)) {
        errors.contact_email = "Invalid email address";
        valid = false;
      }
    }

    if (!contact_name.trim()) {
      errors.contact_name = "Contact Name is required";
      valid = false;
    }

    if (!contact_phone_number.trim()) {
      errors.contact_phone_number = "Contact Phone Number is required";
      valid = false;
    } else {
      const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
      if (!phoneRegex.test(contact_phone_number)) {
        errors.contact_phone_number = "Invalid phone number";
        valid = false;
      }
    }

    console.log("aoc_file", aoc_file);
    console.log("legal_notary_file", legal_notary_file);
    if (aoc_file.length == 0) {
      errors.aoc_file = "Aoc file is required";
      valid = false;
    }

    // Check if Legal Notary files are uploaded
    if (legal_notary_file.length == 0) {
      errors.legal_notary_file = "Legal notary file file is required";
      valid = false;
    }

    // if (enable === null) {
    //   errors.enable = "Enable is required";
    //   valid = false;
    // } else if (isNaN(enable) || enable < 0) {
    //   errors.enable = "Enable must be a valid non-negative number";
    //   valid = false;
    // }

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

  useEffect(() => {
    (async () => {
      console.log("formData====>", JSON.stringify(formData));
      if (isMediaDelete) await updateMedia();
    })();
  }, [formData, isMediaDelete]);

  const fetchSellerDetails = async (sellerId) => {
    try {
      const response = await axios.get(`/sellers/${sellerId}`);

      if (response.status === 200) {
        const sellerDetails = response.data.data;

        // Set form fields with seller details
        setFormData({
          ...sellerDetails,
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
      return response;
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch seller data");
    }
  };

  const uploadAocMedia = async () => {
    try {
      if (!aocFiles?.length) return;

      setResetAocDropzone(false);
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
    try {
      if (!legalFiles?.length) return;

      setResetLegalDropzone(false);
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
    try {
      let updatedFomData = {};
      if (Array.isArray(formData.aoc_file) && formData.aoc_file.length > 0) {
        aocFileArray = [...formData.aoc_file, ...aocFileArray];
      }

      if (
        Array.isArray(formData.legal_notary_file) &&
        formData.legal_notary_file.length > 0
      ) {
        legalFileArray = [...formData.legal_notary_file, ...legalFileArray];
      }

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
            toast.success(
              isEdit ? "Updated Successfully" : "Added Successfully"
            );
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
    } catch (error) {}
  };

  const updateMedia = async () => {
    const updatedFomData = {
      ...formData,
    };

    console.log("updatedFomData====>", updatedFomData, editedSellerId);

    const url = `/sellers/media/${editedSellerId}`;

    const res = await axios.request({
      url,
      method: "put",
      data: updatedFomData,
    });

    console.log("res=====>", res);

    setisMediaDelete(false);
  };

  /*#endregion API CALLS */

  /*#region BUTTON CLICKS */

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const aocFileArray = await uploadAocMedia();

      console.log("aocFileArray=====>", aocFileArray);

      const legalFileArray = await uploadLegalMedia();

      console.log("legalFileArray=====>", legalFileArray);
      await addUpdateSeller(aocFileArray, legalFileArray);
    } catch (error) {}
  };

  const handleChange = (e) => {
    try {
      const { name, value } = e.target;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } catch (error) {}
  };

  const resetForm = () => {
    try {
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
    } catch (error) {}
  };

  /*#endregion BUTTON CLICKS */

  /*#region MODAL CLOSE */

  const handleCloseViewModal = () => {
    try {
      setIsViewModalOpen(false);
      setSelectedSellerDetails(null);
    } catch (error) {}
  };

  const labelsMapping = {
    seller_id: "Seller Id",
    seller_commercial_name: "Seller Commercial Name",
    seller_legal_name: "Seller Legal Name",
    address: "Address",
    tax_identification_number: "Tax Identification Number",
    contact_email: "Contact Email",
    contact_name: "Contact Name",
    contact_phone_number: "Contact Phone Number",
    aoc_file: "AOC File",
    legal_notary_file: "Legal Notary File",
    enable: "Enable",
    date_time_insert: "Inserted Date",
  };

  /*#endregion MODAL CLOSE */

  const renderPdfIcon = () => (
    <img
      alt="Pdf Icon"
      src={require("assets/img/dropzone/pdfIcon.svg").default}
    />
  );

  const renderWordIcon = () => (
    <img
      src={require("assets/img/dropzone/docIcon.svg").default}
      alt="Word Icon"
      // You can set the path to your Word icon image
    />
  );

  const renderImagePreview = (file) => (
    <img
      crossOrigin="anonymous"
      src={file.path}
      onLoad={() => {
        URL.revokeObjectURL(file.path);
      }}
    />
  );
  const renderFileIcon = (file) => {
    switch (file.extension) {
      case "pdf":
        return renderPdfIcon();
      case "docx":
        return renderWordIcon();
      default:
        return renderImagePreview(file);
    }
  };

  const removeFile = async (name, fileType) => {
    console.log("delete file name===>", name);
    setisMediaDelete(true);
    const response = await axios.delete(`/media/${name}`);

    if (response.status === 200) {
      toast.success("File Deleted Succesfully");
      const fileArray =
        fileType === "aoc"
          ? [...formData.aoc_file]
          : [...formData.legal_notary_file];

      // Find the index of the file object with the specified filename
      const index = fileArray.findIndex((file) => file.filename === name);

      if (index !== -1) {
        // Remove the file object from the array
        fileArray.splice(index, 1);

        // Update the state based on the fileType parameter
        setFormData((prevState) => ({
          ...prevState,
          [fileType === "aoc" ? "aoc_file" : "legal_notary_file"]: fileArray,
        }));
      }
    }
  };

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
                    <InputGroup className="input-group-alternative mb-1">
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
                    <InputGroup className="input-group-alternative mb-1">
                      <Input
                        id="seller_legal_name"
                        name="seller_legal_name"
                        value={formData.seller_legal_name}
                        placeholder="Seller Legal Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.seller_legal_name && (
                      <small className="text-danger">
                        {formErrors.seller_legal_name}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <InputGroup className="input-group-alternative mb-1">
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        placeholder="Address"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.address && (
                      <small className="text-danger">
                        {formErrors.address}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="id_number">Tax Identification Number</Label>
                    <InputGroup className="input-group-alternative mb-1">
                      <Input
                        id="id_number"
                        name="tax_identification_number"
                        value={formData.tax_identification_number}
                        placeholder="Tax Identification Number"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.tax_identification_number && (
                      <small className="text-danger">
                        {formErrors.tax_identification_number}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactemail">Contact Email</Label>
                    <InputGroup className="input-group-alternative mb-1">
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
                    {formErrors.contact_email && (
                      <small className="text-danger">
                        {formErrors.contact_email}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactname">Contact Name</Label>
                    <InputGroup className="input-group-alternative mb-1">
                      <Input
                        id="contactname"
                        name="contact_name"
                        value={formData.contact_name}
                        placeholder="Contact Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.contact_name && (
                      <small className="text-danger">
                        {formErrors.contact_name}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactPhoneNumber">Contact Phone Number</Label>
                    <InputGroup className="input-group-alternative mb-1">
                      <Input
                        id="contactPhoneNumber"
                        name="contact_phone_number"
                        value={formData.contact_phone_number}
                        placeholder="Contact Phone Number"
                        type="text"
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {formErrors.contact_phone_number && (
                      <small className="text-danger">
                        {formErrors.contact_phone_number}
                      </small>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="aoc_file">AOC File</Label>
                    <InputGroup className="input-group-alternative mb-1">
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
                    {formErrors.aoc_file && (
                      <small className="text-danger">
                        {formErrors.aoc_file}
                      </small>
                    )}
                    <div className="thumbs-container">
                      {formData.aoc_file.length > 0 &&
                        formData.aoc_file?.map((file) => (
                          <div className="thumb" key={file.filename}>
                            <div className="thumb-inner">
                              {/* Render file icon based on file type */}
                              {renderFileIcon(file)}
                              <div className="icon-bg">
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  color="red"
                                  size="sm"
                                  className="icon-hover"
                                  onClick={() =>
                                    removeFile(file.filename, "aoc")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label for="legal_notary_file">Legal Notary File</Label>
                    <InputGroup className="input-group-alternative mb-1">
                      <Dropzone
                        onFilesUploaded={handleLegalFilesUploaded}
                        resetFiles={resetLegalDropzone}
                      />
                    </InputGroup>
                    {formErrors.legal_notary_file && (
                      <small className="text-danger">
                        {formErrors.legal_notary_file}
                      </small>
                    )}
                    <div className="thumbs-container">
                      {formData.legal_notary_file.length > 0 &&
                        formData.legal_notary_file?.map((file) => (
                          <div className="thumb" key={file.filename}>
                            <div className="thumb-inner">
                              {/* Render file icon based on file type */}
                              {renderFileIcon(file)}
                              <div className="icon-bg">
                                <FontAwesomeIcon
                                  icon={faTrashAlt}
                                  color="red"
                                  size="sm"
                                  className="icon-hover"
                                  onClick={() =>
                                    removeFile(file.filename, "legal")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </FormGroup>
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
                idKey="seller_id"
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
        labelsMapping={labelsMapping}
      />
    </>
  );
};

export default Seller;
