import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import PendingButton from "Components/PendingButton";
import IconButton from "Components/IconButton";
import DropzoneUploader from "Components/DropzoneUploader";
import "./Image.scss";

export default function Image({ imagePath, isDeleting, isUploading, onAddImage, onDeleteImage }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  }, [isDeleting]);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleShowDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="services__image__wrapper">
      {!imagePath && <DropzoneUploader isUploading={isUploading} onDrop={onAddImage} />}
      {imagePath && (
        <div className="service-image">
          <div className="service-image__image-part">
            <img src={`/images/services/${imagePath}`} alt="Service image" />
            <IconButton
              className="action expand"
              type="zoom-in"
              onClick={() => window.open(`/images/services/${imagePath}`, "_blank")}
            />
            <IconButton className="action delete" type="trash" onClick={() => handleShowDeleteModal()} />
          </div>
        </div>
      )}

      <Modal aria-labelledby="contained-modal-title" onHide={handleCloseDeleteModal} show={isDeleteModalOpen}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Delete Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you sure you want to permanently delete this image?</Modal.Body>
        <Modal.Footer>
          <PendingButton
            pending={isDeleting}
            onClick={onDeleteImage}
            text="Delete"
            pendingText="Deleting..."
            bsStyle="danger"
          />
          <Button onClick={handleCloseDeleteModal} disabled={isDeleting}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

Image.propTypes = {
  activeService: PropTypes.object
};
