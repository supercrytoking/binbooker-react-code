import React from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import "./DropzoneUploader.scss";

export default function DropzoneUploader({ acceptFileTypes, acceptMultiple, isUploading, onDrop }) {
  if (isUploading) {
    return (
      <div className="dropzone-uploader--loading">
        <Spinner size="small" />
      </div>
    );
  }

  return (
    <Dropzone onDrop={onDrop} onFileDialogCancel={() => {}}>
      {({ getRootProps, getInputProps, isDragActive }) => {
        const hoverClass = isDragActive ? "dropzone-uploader--hover" : null;

        return (
          <div {...getRootProps()}>
            <input
              {...getInputProps({
                // capture: "environment", // this forces it to use outward-facing camera on phone; but without it, phone gives you option to use camera or choose file (which is better)
                multiple: acceptMultiple,
                accept: acceptFileTypes
              })}
            />
            <div className={`dropzone-uploader ${hoverClass}`}>
              <p>Drag-and-drop a file here, or click here and select a file to upload.</p>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
}

DropzoneUploader.propTypes = {
  acceptFileTypes: PropTypes.string,
  acceptMultiple: PropTypes.bool,
  isUploading: PropTypes.bool,
  onDrop: PropTypes.func.isRequired
};

DropzoneUploader.defaultProps = {
  acceptFileTypes: "image/*",
  acceptMultiple: false,
  isUploading: false
};
