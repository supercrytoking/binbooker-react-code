import React from "react";
import PropTypes from "prop-types";
import { Alert, Modal, Button } from "react-bootstrap";
import PendingButton from "Components/PendingButton";
import IconButton from "Components/IconButton";
import DropzoneUploader from "Components/DropzoneUploader";
import { remove, postFile } from "Utils/services.jsx";
import { ActiveOrderContext } from "../../../ActiveOrderContext";
import "./Attachments.scss";

export default function Attachments({ attachments }) {
  const { activeOrder, setActiveOrder } = React.useContext(ActiveOrderContext);

  const [error, setError] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [activeAttachmentId, setActiveAttachmentId] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
    }
  }, [isDeleting]);

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function handleShowDeleteModal(id) {
    setIsDeleteModalOpen(true);
    setActiveAttachmentId(id);
  }

  async function handleAddAttachment(selectedFiles) {
    if (selectedFiles.length > 1) {
      setError("You can only upload one file at a time.");
      return;
    }

    const file = selectedFiles[0];
    if (file.size > 1024 * 1024 * 10) {
      setError("You can only upload files smaller than 10MB.");
      return;
    }

    if (file.type.indexOf("image") === -1 && file.type.indexOf("pdf") === -1) {
      setError("You can only upload image files and PDFs.");
      return;
    }

    let files = new FormData();
    files.append("fileToUpload", file);

    setIsUploading(true);

    try {
      const { id, filename, notes, path, thumbnailPath } = await postFile(
        `/api/v2/orders/${activeOrder.id}/attachments`,
        files
      );

      // add the attachment to the activeOrder (so added to screen)
      const newActiveOrder = { ...activeOrder };
      newActiveOrder.attachments.push({ id, filename, notes, path, thumbnailPath });
      setActiveOrder(newActiveOrder);
      setIsUploading(false);
    } catch (errorMessage) {
      setError(errorMessage);
      setIsUploading(false);
    }
  }

  async function handleDeleteAttachment(activeAttachmentId) {
    setIsDeleting(true);
    setError(null);

    try {
      await remove(`/api/v2/orders/${activeOrder.id}/attachments/${activeAttachmentId}`);

      // remove the attachment from the activeOrder (so removed from screen)
      const newActiveOrder = { ...activeOrder };
      newActiveOrder.attachments = newActiveOrder.attachments.filter(
        attachment => attachment.id !== activeAttachmentId
      );
      setActiveOrder(newActiveOrder);

      setIsDeleting(false);
    } catch (errorMessage) {
      setError("There was an error deleting this file, please try again. If the problem persists, please contact us.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="order-attachments">
      {error && (
        <Alert
          bsStyle="danger"
          onDismiss={() => {
            setError(null);
          }}
        >
          {error}
        </Alert>
      )}

      <div>
        <DropzoneUploader
          acceptFileTypes="image/*,application/pdf"
          isUploading={isUploading}
          onDrop={handleAddAttachment}
        />
      </div>

      <div className="order-attachments">
        {attachments.map(attachment => (
          <div className="order-attachment" key={attachment.filename}>
            <div className="order-attachment__image-part">
              <img src={attachment.thumbnailPath} alt={attachment.notes} />
              <IconButton
                className="action expand"
                type="zoom-in"
                onClick={() => window.open(attachment.path, "_blank")}
              />
              <IconButton className="action delete" type="trash" onClick={() => handleShowDeleteModal(attachment.id)} />
            </div>
            <div className="order-attachment__notes">{attachment.notes}</div>
          </div>
        ))}
      </div>

      <Modal aria-labelledby="contained-modal-title" onHide={handleCloseDeleteModal} show={isDeleteModalOpen}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Delete Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanently delete this attachment?</Modal.Body>
        <Modal.Footer>
          <PendingButton
            pending={isDeleting}
            onClick={() => {
              handleDeleteAttachment(activeAttachmentId);
            }}
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

Attachments.propTypes = {
  attachments: PropTypes.array
};

Attachments.defaultProps = {
  attachments: []
};
