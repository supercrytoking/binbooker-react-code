import React from "react";
import { arrayOf, func, number, shape, string } from "prop-types";
import { Alert } from "react-bootstrap";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import { UserContext } from "../../UserProvider.jsx";
import Input from "Components/Input";
import PendingButton from "Components/PendingButton";
import SidePanel from "Components/SidePanel";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import Textarea from "Components/Textarea";
import DeleteModal from "Components/DeleteModal";
import Bubbly from "Components/Bubbly";
import { get, post, put, remove } from "Utils/services.jsx";
import "./Zones.scss";

export function ZonesPage({ zones, onDeleteZone, onSaveZone, isCanada }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [activeZone, setActiveZone] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [error, setError] = React.useState("");

  const postalCodesText = isCanada ? "Postal Codes" : "Zip Codes";
  const postalCodeText = isCanada ? "postal code" : "zip code";
  const validPostalCodeFormat = isCanada ? "A1A 1A1" : "12345";

  React.useEffect(() => {
    document.title = "Zones";
  }, []);

  function isValidPostalCode(postalCode) {
    let pattern;

    if (isCanada) {
      pattern = /^[A-Z*]{1}[0-9*]{1}[A-Z*]{1}(\s)[0-9*]{1}[A-Z*]{1}[0-9*]{1}$/;
      return postalCode.match(pattern);
    }

    pattern = /^[0-9*]{5}$/;
    return postalCode.match(pattern);
  }

  function validatePostalCodes(postalCodes) {
    let error = "";

    postalCodes.forEach(postalCode => {
      if (!isValidPostalCode(postalCode)) {
        error = `The ${postalCodeText} "${postalCode}" is not valid. Ensure each is its own line and uses the format: ${validPostalCodeFormat}`;
      }
    });
    return error;
  }

  async function onClickSave() {
    setError("");

    if (!activeZone.name.length) {
      setError("You must enter a name.");
      return;
    }

    if (activeZone.name.length > 50) {
      setError("Name must be less than 50 characters.");
      return;
    }

    const zoneNameExists = zones.find(zone => zone.name === activeZone.name && zone.id !== activeZone.id);
    if (zoneNameExists) {
      setError("This name is already in use; please choose a unique name.");
      return;
    }

    const postalCodesError = validatePostalCodes(activeZone.postalCodes);
    if (postalCodesError) {
      setError(postalCodesError);
      return;
    }

    setIsSaving(true);

    try {
      await onSaveZone(activeZone.id, activeZone.name, activeZone.postalCodes);
      setActiveZone(null);
    } catch (errorMessage) {
      setError(errorMessage);
    }

    setIsSaving(false);
  }

  function renderActionButtons() {
    const text = activeZone && activeZone.id ? "Save" : "Create";
    const pendingText = activeZone && activeZone.id ? "Saving..." : "Creating...";

    return (
      <div className="zones-action-buttons">
        <PendingButton
          pending={isSaving}
          disabled={isSaving || isDeleting}
          onClick={onClickSave}
          bsStyle="primary"
          text={text}
          pendingText={pendingText}
        />
        {activeZone && activeZone.id && (
          <PendingButton
            pending={isDeleting}
            disabled={isSaving || isDeleting}
            onClick={() => {
              setShowDeleteModal(true);
            }}
            bsStyle="default"
            text="Delete"
            pendingText="Deleting..."
          />
        )}
      </div>
    );
  }

  function renderSidePanel() {
    return (
      <SidePanel
        open={!!activeZone}
        onClose={() => {
          setActiveZone(null);
        }}
        heading={activeZone && activeZone.id ? "Edit Zone" : "Create Zone"}
        width="small"
      >
        <div className="zones-sidepanel">
          {error && (
            <Alert
              bsStyle="danger"
              onDismiss={() => {
                setError("");
              }}
            >
              {error}
            </Alert>
          )}
          <Input
            name="name"
            disabled={isSaving}
            label="Name*"
            onChange={e => {
              const newActiveZone = { ...activeZone };
              newActiveZone.name = e.target.value;
              setActiveZone(newActiveZone);
            }}
            value={activeZone && activeZone.name ? activeZone.name : ""}
          />
          <Textarea
            name="postalCodes"
            disabled={isSaving}
            label={postalCodesText}
            onChange={e => {
              const newActiveZone = { ...activeZone };
              newActiveZone.postalCodes = e.target.value.split("\n");
              setActiveZone(newActiveZone);
            }}
            rows={10}
            value={activeZone && activeZone.postalCodes ? activeZone.postalCodes.join("\n") : ""}
          />
          {renderActionButtons()}
        </div>
      </SidePanel>
    );
  }

  function renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Zone"
        isVisible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        onDelete={async () => {
          setIsDeleting(true);
          await onDeleteZone(activeZone.id);
          setIsDeleting(false);
          setShowDeleteModal(false);
          setActiveZone(null);
        }}
        isPending={isDeleting}
      />
    );
  }

  function renderTable() {
    if (!zones) {
      return <SpinnerCentred />;
    }

    if (!zones.length) {
      return (
        <Bubbly
          title="No Zones"
          description="Click the button below to create your first Zone."
          actionTitle="Create new Zone"
          onClick={() => {
            setActiveZone({ id: null, name: "", postalCodes: [] });
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="zones__name">Name</th>
              <th className="zones__postal-codes">{postalCodesText}</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(zone => {
              return (
                <tr
                  key={zone.id}
                  onClick={() => {
                    setActiveZone(zone);
                  }}
                >
                  <td>{zone.name}</td>
                  <td>{zone.postalCodes.map(postalCode => postalCode).join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PendingButton
          bsStyle="default"
          text="Create new Zone"
          onClick={() => {
            setActiveZone({ id: null, name: "", postalCodes: [] });
          }}
        />
      </React.Fragment>
    );
  }

  return (
    <div className="zones-page">
      {renderTable()}
      {renderSidePanel()}
      {renderDeleteModal()}
    </div>
  );
}

ZonesPage.propTypes = {
  zones: arrayOf(shape({ id: number, name: string, postalCodes: arrayOf(string) })).isRequired,
  onDeleteZone: func.isRequired,
  onSaveZone: func.isRequired
};

ZonesPage.defaultProps = {};

export default function ZonesPageWrapper() {
  const [zones, setZones] = React.useState(null);
  const loggedInStaff = React.useContext(LoggedInStaffContext);
  const user = React.useContext(UserContext);

  React.useEffect(() => {
    async function getZones() {
      const zones = await get("/api/v2/zones");
      setZones(zones);
    }
    getZones();
  }, []);

  if (!loggedInStaff) {
    return <SpinnerCentred />;
  }

  if (!loggedInStaff.pageAccess.manageZones) {
    return null;
  }

  if (!zones) {
    return null;
  }

  async function handleSaveZone(id, name, postalCodes) {
    if (id) {
      const newZones = await put("/api/v2/zones", { id, name, postalCodes });
      setZones(newZones);
    } else {
      const newZones = await post("/api/v2/zones", { name, postalCodes });
      setZones(newZones);
    }
  }

  async function handleDeleteZone(id) {
    const newZones = await remove("/api/v2/zones", { id });
    setZones(newZones);
  }

  return (
    <ZonesPage
      zones={zones}
      onDeleteZone={handleDeleteZone}
      onSaveZone={handleSaveZone}
      isCanada={user.currency === "CAD"}
    />
  );
}
