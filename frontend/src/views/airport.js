import React, { useEffect, useState } from "react";
import CommonHeader from "components/Headers/CommonHeader";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Container, Row } from "reactstrap";
import styled, { keyframes } from "styled-components";

const Airport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      name: "Airport Name",
      selector: (row) => row.airportname,
      sortField: "airportname",
      sortable: true,
      customFilterText: (term, row) => row.airportname.includes(term),
    },
    {
      name: "Airport Iata code",
      selector: (row) => row.airportiatacode,
      sortable: true,
      sortField: "airportiatacode",
      customFilterText: (term, row) => row.airportiatacode.includes(term),
    },
    {
      name: "Airport Icao code",
      selector: (row) => row.airporticaocode,
      sortable: true,
      sortField: "airporticaocode",
      customFilterText: (term, row) => row.airporticaocode.includes(term),
    },
  ];

  const fetchAirports = async (page, size = perPage, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/airport?page=${page}&pageSize=${size}&searchTerm=${search}`
      );
      setData(response.data.data.data);
      setTotalRows(response.data.data.total);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (page, size, search) => {
    await fetchAirports(page, size, search);
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchAirports(1, perPage, searchTerm);
  }, [searchTerm]);

  return (
    <>
      <CommonHeader />
      <Container className="mt--9" fluid>
        <Row className="justify-content-center">
          <div className="col-md-8">
            <DataTable
              title="Airport List"
              columns={columns}
              data={data}
              progressPending={loading}
              progressComponent={<CustomLoader />}
              pagination
              paginationServer
              sortServer
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={(pageSize, page) =>
                handleAction(page, pageSize, searchTerm)
              }
              onChangePage={(page) => handleAction(page, perPage, searchTerm)}
              onSearch={(search) => setSearchTerm(search)}
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  className="w-50 form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              }
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

const Spinner = styled.div`
  margin: 16px auto;
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const CustomLoader = () => (
  <div style={{ padding: "24px" }}>
    <Spinner />
    <div>Fancy Loader...</div>
  </div>
);

export default Airport;
