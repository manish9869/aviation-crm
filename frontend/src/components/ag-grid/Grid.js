import React from "react";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";

const Grid = ({ rowData, columnDefs, onEdit, onDelete, onView }) => {
  const actionsCellRenderer = (params) => (
    <>
      <FontAwesomeIcon
        icon={faEye}
        color="green"
        size="lg"
        className="mr-2 icon-hover"
        onClick={() => onView(params.data.seller_id)}
      />
      <FontAwesomeIcon
        icon={faEdit}
        color="blue"
        size="lg"
        className="mr-2 icon-hover"
        onClick={() => onEdit(params.data.seller_id)}
      />
      <FontAwesomeIcon
        icon={faTrashAlt}
        color="red"
        size="lg"
        className="icon-hover"
        onClick={() => onDelete(params.data.seller_id)}
      />
    </>
  );

  const updatedColumnDefs = [
    ...columnDefs,
    {
      headerName: "Actions",
      cellRenderer: actionsCellRenderer,
      editable: false,
      colId: "actions",
    },
  ];

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={updatedColumnDefs}
        pagination={true}
        paginationPageSize={15}
        paginationPageSizeSelector={[15, 20, 50, 100]}
        rowSelection={"single"}
      />
    </div>
  );
};

export default Grid;
