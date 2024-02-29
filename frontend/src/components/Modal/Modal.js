import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "reactstrap";


const ViewModal = ({ isOpen, onClose, data, labelsMapping }) => {
  if (!isOpen || !data) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg">
      <ModalHeader
        toggle={onClose}
        className="bg-primary text-white"
        style={{ fontSize: "20px" }}
      >
        More Details
      </ModalHeader>
      <ModalBody>
        <Card>
          <CardBody style={{ maxHeight: "400px", overflowY: "auto" }}>
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <strong style={{ minWidth: "150px", color: "#525f7f" }}>
                    {labelsMapping[key] || key}:
                  </strong>
                  <span>{value}</span>
                </div>
                <hr className="my-2" style={{ borderColor: "#e9ecef" }} />
              </div>
            ))}
          </CardBody>
        </Card>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

export default ViewModal;
