import React, { useState } from "react";
import CommonHeader from "components/Headers/CommonHeader";
import axios from "axios";
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

const Role = () => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roles, setRoles] = useState([]);

  const myColDefs = [
    { headerName: "Role", 
    field: "roleName", 
    sortable: true,
     filter: true },
    {
      headerName: "Role Description",
      field: "roleDescription",
      sortable: true,
      filter: true,
    },
  ];

  const handleSubmit = () => {
    const newRole = { roleName, roleDescription };
    setRoles([...roles, newRole]);
    setRoleName("");
    setRoleDescription("");
  };

  const gridOptions = {
    columnDefs: myColDefs,
    rowData: roles,
    pagination: true,
    paginationPageSize: 15,
    paginationPageSizeSelector: [15, 20, 50, 100],
    rowSelection: "single",
    onRowClicked: (event) => console.log("A row was clicked"),
    onColumnResized: (event) => console.log("A column was resized"),
    onGridReady: (event) => console.log("The grid is now ready"),
    isScrollLag: () => false,
  };

  return (
    <>
      <CommonHeader />
      <Container className="mt--9" fluid>
        <Row>
          <div className="col-md-5">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Add Role</h3>
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
                      <Input
                        placeholder="Role Name"
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                      />
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
                        placeholder="Role Description"
                        type="text"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
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

export default Role;
