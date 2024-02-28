import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Details</ModalHeader>
      <ModalBody>
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))}
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
