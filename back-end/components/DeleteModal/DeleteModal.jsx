import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import PendingButton from "../PendingButton";

export default function DeleteModal(props) {
  const { isVisible, isPending, onDelete, onClose, subjectName } = props;

  return (
    <Modal backdrop="static" show={isVisible} enforceFocus onHide={onClose} keyboard={!isPending} restoreFocus>
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>Delete {subjectName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this {subjectName}?</p>
      </Modal.Body>
      <Modal.Footer>
        <PendingButton
          disabled={isPending}
          pending={isPending}
          onClick={onDelete}
          text="Delete"
          pendingText="Deleting..."
          bsStyle="danger"
        />
      </Modal.Footer>
    </Modal>
  );
}

DeleteModal.propTypes = {
  subjectName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired
};
