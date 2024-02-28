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
} from "reactstrap";

import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Seller = () => {
  const navigate = useNavigate();

  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(false);

  const [seller_commerical_name, setSellerCommericalName] = useState();
  const [seller_legal_name, setSellerLegalName] = useState();
  const [address, setAddress] = useState();
  const [tax_identification_number, setTaxIdentificationNumber] = useState();
  const [contact_email, setEmail] = useState();
  const [contact_name, setContactName] = useState();
  const [contact_phone_number, setContactPhoneNumber] = useState();
  const [aoc_file, setAOC] = useState();
  const [legal_notary_file, setLegal] = useState();
  const [enable, setEnable] = useState();

  const handleEnableValue = (e) => {
    // Parse the input value to a number
    const enableValue = parseInt(e.target.value, 10);
    setEnable(enableValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/seller", {
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
      })
      .then((result) => {
        console.log(result);
        navigate("/admin/index");
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setError(false);
  //       const response = await axios.get("/seller");
  //       console.log("seller get-=====>", response.data.data);
  //       setSellers(response.data.data);

  //     } catch (error) {
  //       setError(true);
  //     }
  //   })();
  // }, []);

  const [rowData, setRowData] = useState();

  const onGridReady = (params) => {
    axios.get("/seller").then((data) => {
      console.log("Data => " + data.data);
      setRowData(data.data);
    });
  };

  const myColDefs = [
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
  ];

  const gridOptions = {
    // PROPERTIES
    // Objects like myRowData and myColDefs would be created in your application
    rowData: sellers,
    columnDefs: myColDefs,
    pagination: true,
    // paginationAutoPageSize: false,
    paginationPageSize: 15,
    paginationPageSizeSelector: [15, 20, 50, 100],
    rowSelection: "single",
    // onGridReady={onGridReady},

    // EVENTS
    // Add event handlers
    onRowClicked: (event) => console.log("A row was clicked"),
    onColumnResized: (event) => console.log("A column was resized"),
    onGridReady: onGridReady,

    // CALLBACKS
    isScrollLag: () => false,
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
                <h3 className="mb-0">Add Seller</h3>
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
                        placeholder="enable"
                        type="number"
                        value={enable}
                        onChange={handleEnableValue}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* <Row className="my-4">
                    <Col xs="12">
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id="customCheckRegister"
                          type="checkbox"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheckRegister"
                        >
                          <span className="text-muted">
                            I agree with the{" "}
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </Col>
                  </Row> */}
                  <div className="text-center">
                    <Button className="mt-4" color="danger" type="button">
                      Clear
                    </Button>
                    <Button
                      className="mt-4"
                      color="primary"
                      type="button"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>

          <div className="col-md-7">
            <div className="ag-theme-quartz" style={{ height: 500 }}>
              <AgGridReact gridOptions={gridOptions} />
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Seller;
