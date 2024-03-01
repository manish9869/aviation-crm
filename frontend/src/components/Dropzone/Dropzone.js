import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { faTrashAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./dropzone.css";
import { toast } from "react-toastify";
const Dropzone = ({ onFilesUploaded, resetFiles }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      console.log("rejectedFiles", rejectedFiles);
      if (acceptedFiles?.length) {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
        onFilesUploaded(acceptedFiles);
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
        rejectedFiles.forEach((file) =>
          toast.error(`${file.file.name} is too large!`)
        );
      }
    },
    [onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:
      "image/jpeg, image/png, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Accepts JPEG, PNG, PDF, .doc, and .docx files
    maxSize: 1024 * 1000,
    onDrop,
  });

  useEffect(() => {
    setFiles([]);
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [resetFiles]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const renderPdfIcon = () => (
    <img
      alt="Pdf Icon"
      src={require("assets/img/dropzone/pdfIcon.svg").default}
    />
  );

  const renderWordIcon = () => (
    <img
      src={require("assets/img/dropzone/docIcon.svg").default}
      alt="Word Icon"
      // You can set the path to your Word icon image
    />
  );

  const renderImagePreview = (file) => (
    <img
      src={file.preview}
      onLoad={() => {
        URL.revokeObjectURL(file.preview);
      }}
    />
  );
  const renderFileIcon = (file) => {
    switch (file.type) {
      case "application/pdf":
        return renderPdfIcon();
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return renderWordIcon();
      default:
        return renderImagePreview(file);
    }
  };

  const thumbs = files.map((file) => (
    <div className="thumb" key={file.name}>
      <div className="thumb-inner">
        {/* Render file icon based on file type */}
        {renderFileIcon(file)}
        <div className="icon-bg">
          <FontAwesomeIcon
            icon={faTrashAlt}
            color="red"
            size="sm"
            className="icon-hover"
            onClick={() => removeFile(file.name)}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <div>
        <section className="container">
          <div
            {...getRootProps({
              className: "dropzone dropzone-container",
            })}
          >
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faUpload} />
            <p className="pStyle">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </section>
      </div>

      <aside className="thumbs-container">{thumbs}</aside>
    </>
  );
};

export default Dropzone;
