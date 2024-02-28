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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";

import ViewModal from "components/Sellers/Modal"

const Seller = () => {
  <ToastContainer />;
  const navigate = useNavigate();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSellerDetails, setSelectedSellerDetails] = useState(null);
  const [error, setError] = useState(false);

  const [editedSellerId, setEditedSellerId] = useState(null);

  const [rowData, setRowData] = useState([]);
  const [seller_commerical_name, setSellerCommericalName] = useState("");
  const [seller_legal_name, setSellerLegalName] = useState("");
  const [address, setAddress] = useState("");
  const [tax_identification_number, setTaxIdentificationNumber] = useState("");
  const [contact_email, setEmail] = useState("");
  const [contact_name, setContactName] = useState("");
  const [contact_phone_number, setContactPhoneNumber] = useState("");
  const [aoc_file, setAOC] = useState("");
  const [legal_notary_file, setLegal] = useState("");
  const [enable, setEnable] = useState();

  const [isEdit, setIsEdit] = useState(false);

  const handleEnableValue = (e) => {
    // Parse the input value to a number
    const enableValue = parseInt(e.target.value, 10);
    setEnable(enableValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEdit ? `/seller/${editedSellerId}` : "/seller";

    axios
      .request({
        url,
        method: isEdit ? "put" : "post",
        data: {
          seller_commerical_name,
          seller_legal_name,
          address,
          tax_identification_number,
          contact_email,
          contact_name,
          contact_phone_number,
          aoc_file,
          legal_notary_file,
          enable,
        },
      })
      .then(async (result) => {
        console.log(result);
        if (result) {
          toast.success(isEdit ? "Updated Successfully" : "Added Successfully");
          const getResponse = await axios.get("/seller");
          setRowData(getResponse.data.data);

          // Scroll to the top of the page
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Reset form and edit mode after submission
          resetForm();
          setIsEdit(false);
          setEditedSellerId(null);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          isEdit ? "Failed to update Seller" : "Failed to add Seller"
        );
      });
  };

  useEffect(() => {
    (async () => {
      try {
        setError(false);
        const response = await axios.get("/seller");
        console.log("seller get-=====>", response.data.data);
        setRowData(response.data.data);
      } catch (error) {
        setError(true);
      }
    })();
  }, []);

  // const handleEdit = (sellerId) => {
  //   // Implement your logic to navigate to the edit page with the sellerId
  //   console.log(`Edit Seller with ID: ${sellerId}`);
  // };

  const fetchSellerDetails = async (sellerId) => {
    try {
      console.log("Fetching seller details for ID:", sellerId);
      const response = await axios.get(`/seller/${sellerId}`);
      console.log("Response:", response);
      if (response.status === 200) {
        const sellerDetails = response.data.data;
        console.log("Seller Details " + sellerDetails);
        // Set form fields with seller details
        setSellerCommericalName(sellerDetails.seller_commerical_name);
        setSellerLegalName(sellerDetails.seller_legal_name);
        setAddress(sellerDetails.address);
        setTaxIdentificationNumber(sellerDetails.tax_identification_number);
        setEmail(sellerDetails.contact_email);
        setContactName(sellerDetails.contact_name);
        setContactPhoneNumber(sellerDetails.contact_phone_number);
        setAOC(sellerDetails.aoc_file);
        setLegal(sellerDetails.legal_notary_file);
        setEnable(sellerDetails.enable);
      } else {
        toast.error("Failed to fetch seller details");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching seller details");
    }
  };

  const handleEdit = (sellerId) => {
    // Fetch seller details by ID and set form fields
    fetchSellerDetails(sellerId);
    setIsEdit(true); // Set edit mode
    setEditedSellerId(sellerId); // Set the ID of the seller being edited
  };

  const handleDelete = async (sellerId) => {
    try {
      const response = await axios.delete(`/seller/${sellerId}`);
      console.log(response);

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
      console.log("View");
      const response = await axios.get(`/seller/${sellerId}`);
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

  const actionsCellRenderer = (params) => (
    <>
      <FontAwesomeIcon
        icon={faEye}
        color="green"
        size="lg"
        className="mr-2 icon-hover"
        onClick={() => {
          console.log("Inside view button");
          handleView(params.data.seller_id);
        }}
      />
      <FontAwesomeIcon
        icon={faEdit}
        color="blue"
        size="lg"
        className="mr-2 icon-hover"
        onClick={() => {
          console.log("Inside edit button");
          handleEdit(params.data.seller_id);
        }}
      />
      <FontAwesomeIcon
        icon={faTrashAlt}
        color="red"
        size="lg"
        className="icon-hover"
        onClick={() => handleDelete(params.data.seller_id)}
      />
    </>
  );

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Commerical Name",
      field: "seller_commerical_name",
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
    {
      headerName: "action",
      // minWidth: 150,
      cellRenderer: actionsCellRenderer,
      editable: false,
      colId: "action",
    },
  ]);

  const resetForm = () => {
    setSellerCommericalName("");
    setSellerLegalName("");
    setAddress("");
    setTaxIdentificationNumber("");
    setEmail("");
    setContactName("");
    setContactPhoneNumber("");
    setAOC("");
    setLegal("");
    setEnable("");
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedSellerDetails(null);
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
                    <Label
                      className="custom-label"
                      for="seller_commerical_name"
                    >
                      Seller Commercial Name
                    </Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="seller_commerical_name"
                        value={seller_commerical_name}
                        placeholder="Seller Commercial Name"
                        type="text"
                        onChange={(e) =>
                          setSellerCommericalName(e.target.value)
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="seller_legal_name">Seller Legal Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="seller_legal_name"
                        value={seller_legal_name}
                        placeholder="Seller Legal Name"
                        type="text"
                        onChange={(e) => setSellerLegalName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="address"
                        value={address}
                        placeholder="Address"
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="id_number">Tax Identification Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="id_number"
                        value={tax_identification_number}
                        placeholder="Tax Identification Number"
                        type="text"
                        onChange={(e) =>
                          setTaxIdentificationNumber(e.target.value)
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactemail">Contact Email</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactemail"
                        value={contact_email}
                        placeholder="Contact Email"
                        type="email"
                        autoComplete="new-email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactname">Contact Name</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactname"
                        value={contact_name}
                        placeholder="Contact Name"
                        type="text"
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="contactPhoneNumber">Contact Phone Number</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="contactPhoneNumber"
                        value={contact_phone_number}
                        placeholder="Contact Phone Number"
                        type="text"
                        onChange={(e) => setContactPhoneNumber(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="aoc_file">AOC File</Label>
                    <InputGroup className="input-group-alternative mb-3">
                      <Input
                        id="aoc_file"
                        value={aoc_file}
                        placeholder="AOC File"
                        type="text"
                        onChange={(e) => setAOC(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="legal_notary_file">Legal Notary File</Label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        id="legal_notary_file"
                        value={legal_notary_file}
                        placeholder="Legal Notary File"
                        type="text"
                        onChange={(e) => setLegal(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <Label for="enable">Enable</Label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        id="enable"
                        placeholder="enable"
                        type="number"
                        value={enable}
                        onChange={handleEnableValue}
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
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={15}
                paginationPageSizeSelector={[15, 20, 50, 100]}
                rowSelection={"single"}
              />
            </div>
          </div>
          <ToastContainer />
        </Row>
      </Container>
      <ViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        sellerDetails={selectedSellerDetails}
      />
    </>
  );
};

export default Seller;
