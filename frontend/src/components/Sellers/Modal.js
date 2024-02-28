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

const ViewModal = ({ isOpen, onClose, sellerDetails }) => {
  if (!isOpen || !sellerDetails) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Seller Details</ModalHeader>
      <ModalBody>
        <p>
          <strong>Commercial Name:</strong>{" "}
          {sellerDetails.seller_commerical_name}
        </p>
        <p>
          <strong>Legal Name:</strong> {sellerDetails.seller_legal_name}
        </p>
        <p>
          <strong>Address:</strong> {sellerDetails.address}
        </p>
        <p>
          <strong>Tax Identification Number:</strong>{" "}
          {sellerDetails.tax_identification_number}
        </p>
        <p>
          <strong>Contact Email:</strong> {sellerDetails.contact_email}
        </p>
        <p>
          <strong>Contact Name:</strong> {sellerDetails.contact_name}
        </p>
        <p>
          <strong>Contact Phone Number:</strong>{" "}
          {sellerDetails.contact_phone_number}
        </p>
        <p>
          <strong>AOC File:</strong> {sellerDetails.aoc_file}
        </p>
        <p>
          <strong>Legal Notary File:</strong> {sellerDetails.legal_notary_file}
        </p>
        <p>
          <strong>Enable:</strong> {sellerDetails.enable}
        </p>
        {/* Display other details similarly */}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewModal;
