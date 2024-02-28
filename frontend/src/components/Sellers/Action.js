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

import {handleView, handleEdit, handleDelete} from "views/Seller"

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

  export default actionsCellRenderer;