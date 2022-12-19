import React from "react";
import SidePanel from "Components/SidePanel";
import Errors from "Components/Errors";
import Input from "Components/Input";
import PendingButton from "Components/PendingButton";
import DeleteModal from "Components/DeleteModal";
import { BinsContext } from "../BinsContainer";

export default function BinSidePanel() {
  const {
    activeBin,
    isPending,
    setIsDeleteModalOpen,
    isDeleteModalOpen,
    isSidePanelOpen,
    setIsSidePanelOpen,
    error,
    onClearError,
    onClickSave,
    onClickDelete
  } = React.useContext(BinsContext);
  const isCreating = activeBin.id === null;

  // Use local variables so entire app doesnt re-render when typing in new values
  const [foreignId, setForeignId] = React.useState(activeBin.foreignId);
  const [size, setSize] = React.useState(activeBin.size);
  const [isActive, setIsActive] = React.useState(activeBin.isActive);

  React.useEffect(() => {
    setForeignId(activeBin.foreignId);
    setSize(activeBin.size);
    setIsActive(activeBin.isActive);
  }, [activeBin]);

  function renderSaveButton() {
    const text = isCreating ? "Create" : "Save";
    const pendingText = isCreating ? "Creating..." : "Saving...";

    return (
      <PendingButton
        disabled={isPending}
        onClick={() => {
          onClickSave(activeBin.id, foreignId, size, isActive);
        }}
        pending={isPending}
        pendingText={pendingText}
        text={text}
      />
    );
  }

  function renderDeleteButton() {
    if (isCreating) {
      return null;
    }

    return (
      <PendingButton
        bsStyle="default"
        disabled={isPending}
        onClick={() => {
          setIsDeleteModalOpen(true);
        }}
        text="Delete"
        pendingText="Deleting..."
      />
    );
  }

  return (
    <SidePanel
      open={isSidePanelOpen}
      onClose={() => {
        setIsSidePanelOpen(false);
      }}
      heading="Bin"
      width="small"
    >
      <div className="bins-details">
        {error && <Errors errors={[error]} onDismiss={onClearError} />}
        <Input
          label="ID"
          disabled={isPending}
          name="bin-id"
          value={foreignId}
          onChange={e => {
            setForeignId(e.target.value);
          }}
        />
        <Input
          label="Size"
          disabled={isPending}
          name="bin-size"
          type="number"
          min="1"
          value={size}
          onChange={e => {
            setSize(e.target.value);
          }}
        />
        <div className="form-check">
          <label htmlFor="bin-is-active" className="form-check-label">
            Rentable?
            <input
              type="checkbox"
              className="form-check-input"
              disabled={isPending}
              name="bin-is-active"
              checked={isActive === "1"}
              onChange={() => {
                setIsActive(isActive === "1" ? "0" : "1");
              }}
            />
          </label>
          <div className="btn__save">
            {renderSaveButton()}
            {renderDeleteButton()}
            <DeleteModal
              subjectName="Bin"
              isVisible={isDeleteModalOpen}
              isPending={isPending}
              onClose={() => {
                setIsDeleteModalOpen(false);
              }}
              onDelete={() => onClickDelete(activeBin.id)}
            />
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
