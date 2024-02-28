import React from "react";
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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

import { AgGridReact } from "ag-grid-react";


const User = () => {
  const data = [
    { make: "BMW", model: "M3", price: 70000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model S Plaid", price: 120000 },
    { make: "BMW", model: "M4", price: 70000 },
    { make: "Toyota", model: "Camry", price: 25000 },
    { make: "Tesla", model: "Model 3 ", price: 60000 },
    { make: "BMW", model: "M5", price: 170000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model Y", price: 60000 },
    { make: "BMW", model: "M3", price: 70000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model S Plaid", price: 120000 },
    { make: "BMW", model: "M3", price: 70000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model S Plaid", price: 120000 },
    { make: "BMW", model: "M3", price: 70000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model S Plaid", price: 120000 },
    { make: "BMW", model: "M3", price: 70000 },
    { make: "Toyota", model: "Corolla", price: 25000 },
    { make: "Tesla", model: "Model S Plaid", price: 120000 },
  ];

  const myColDefs = [
    { headerName: "Make", field: "make", sortable: true, filter: true },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Price (USD)", field: "price", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRendererFramework: (params) => (
        <>
          <Button color="primary" size="sm" onClick={() => handleEdit(params)}>
            Edit
          </Button>{" "}
          <Button color="danger" size="sm" onClick={() => handleDelete(params)}>
            Delete
          </Button>
        </>
      ),
    },
  ];


  const handleEdit = (params) => {
    // Add logic for handling edit action
    console.log("Edit row:", params.data);
  };

  const handleDelete = (params) => {
    // Add logic for handling delete action
    console.log("Delete row:", params.data);
  };


  const gridOptions = {
    // PROPERTIES
    // Objects like myRowData and myColDefs would be created in your application
    rowData: data,
    columnDefs: myColDefs,
    pagination: true,
    // paginationAutoPageSize: false,
    paginationPageSize: 15,
    paginationPageSizeSelector: [15, 20, 50, 100],
    rowSelection: "single",

    // EVENTS
    // Add event handlers
    onRowClicked: (event) => console.log("A row was clicked"),
    onColumnResized: (event) => console.log("A column was resized"),
    onGridReady: (event) => console.log("The grid is now ready"),

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
                <h3 className="mb-0">Add User</h3>
              </CardHeader>
              <CardBody>
                <Form role="form">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-hat-3" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Name" type="text" />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-email-83" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                      />
                    </InputGroup>
                  </FormGroup>

                  <Row className="my-4">
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
                  </Row>
                  <div className="text-center">
                    <Button className="mt-4" color="danger" type="button">
                      Clear
                    </Button>
                    <Button className="mt-4" color="primary" type="button">
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

export default User;
