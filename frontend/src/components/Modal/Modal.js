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

  const renderValue = (key, data) => {
    if (key === "enable") {
      return <span>{data === 1 ? "True" : "False"}</span>;
    }

    if (data !== null && typeof data === "object") {
      console.log("Inside modal " + JSON.stringify(data));

      // Extract specific properties if present
      const extractedValue =
        data.role_name || data.user_type || data.seller_commercial_name || data.currency_name || data.category_name;

      console.log("Extracted Value----- " + extractedValue);
      if (extractedValue) {
        // If any specific property is found, display it directly
        return (
          <div className="mb-3">
            <span>{extractedValue}</span>
            {/* <hr className="my-2" style={{ borderColor: "#e9ecef" }} /> */}
          </div>
        );
      }

      // If no specific property is found, iterate through the object
      // return Object.entries(data).map(([nestedKey, nestedValue]) => (
      //   <div key={nestedKey} className="mb-3">
      //     <div className="d-flex justify-content-between align-items-center">
      //       <strong style={{ minWidth: "150px", color: "#525f7f" }}>
      //         {labelsMapping[nestedKey] || nestedKey}:
      //       </strong>
      //       {renderValue(nestedValue)}
      //     </div>
      //     <hr className="my-2" style={{ borderColor: "#e9ecef" }} />
      //   </div>
      // ));
    } else {
      // Render non-object data
      return <span>{data}</span>;
    }
  };

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
            {Object.entries(data).map(([key, data]) => (
              <div key={key} className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <strong style={{ minWidth: "150px", color: "#525f7f" }}>
                    {labelsMapping[key] || key}:
                  </strong>
                  {renderValue(key, data)}
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
