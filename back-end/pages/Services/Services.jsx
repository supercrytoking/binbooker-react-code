import React from "react";
import classnames from "classnames";
import { Tabs, Tab } from "react-bootstrap";
import produce from "immer";
import { LoggedInStaffContext } from "../../LoggedInStaffProvider.jsx";
import ServicesContext from "./ServicesContext.jsx";
import SidePanel from "Components/SidePanel";
import PendingButton from "Components/PendingButton";
import Details from "./Details";
import Pricing from "./Pricing";
import SpinnerCentred from "Components/Spinner/SpinnerCentred.jsx";
import DeleteModal from "Components/DeleteModal";
import Errors from "Components/Errors";
import Bubbly from "Components/Bubbly";
import { get, put, remove, postFile } from "Utils/services.jsx";
import { isValidDollarAmount } from "Utils/library.jsx";
import "./Services.scss";

// TODO: the 'bin size' could be a select and not disabled (but where get all available bin sizes? add to user object? is it bad if they were to change it?) database-reset script may have to update, too.
// TODO: create service? low usage, small work. i'll also have to update the database-reset script to delete any services they make

function ServicesWithContext({ services, onSave, onDelete, onImageChange }) {
  const { activeService, setActiveService } = React.useContext(ServicesContext);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [isDeletingImage, setIsDeletingImage] = React.useState(false);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const [error, setError] = React.useState(null);

  function clickedRow(service) {
    setActiveService(service);
  }

  function renderTable() {
    if (!services) {
      return <SpinnerCentred />;
    }

    if (!services.length) {
      return (
        <Bubbly
          title="No Services"
          description="Click the button below to create your first Service."
          actionTitle="Does not exist..."
          onClick={() => {
            alert("...do it in the database");
          }}
        />
      );
    }

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th className="services__title">Title</th>
            <th className="services__description">Description</th>
            <th className="services__size">Size</th>
            <th className="services__image">Image</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => {
            const imagePath = `/images/services/${service.imagePath}`;
            const rowClass = classnames({ active: activeService && activeService.id === service.id });

            return (
              <tr
                key={service.id}
                onClick={() => {
                  clickedRow(service);
                }}
                className={rowClass}
              >
                <td>{service.title}</td>
                <td dangerouslySetInnerHTML={{ __html: service.description }} />
                <td>{service.size}</td>
                <td>{service.imagePath && <img src={imagePath} alt={service.title} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  function closeDeleteServiceModal() {
    setShowDeleteServiceModal(false);
  }

  function handleCloseSidePanel() {
    setActiveService(null);
  }

  async function handleSave() {
    let hasError = false;

    if (activeService.title.length === 0 || activeService.title.length > 50) {
      setError('"Title" must be between 1 and 50 characters.');
      hasError = true;
    }

    if (activeService.description.length > 500) {
      setError('"Description" cannot be longer than 500 characters.');
      hasError = true;
    }

    if (activeService.extraCostPerDay === "") {
      setError('"Extra cost per day" cannot be blank.');
      hasError = true;
    }

    if (activeService.extraCostPerDay < 0) {
      setError('"Extra cost per day" cannot be less than zero.');
      hasError = true;
    }

    if (activeService.includedDays === "") {
      setError('"Included days" cannot be blank.');
      hasError = true;
    }

    if (activeService.includedDays < 0) {
      setError('"Included days" cannot be less than zero.');
      hasError = true;
    }

    activeService.zones.map(zone => {
      if (!isValidDollarAmount(zone.rentalPrice, false)) {
        setError(`For zone "${zone.name}", the price "${zone.rentalPrice}" is not valid.`);
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    setIsSaving(true);
    try {
      setError(null);
      await onSave(activeService);
      setActiveService(null);
    } catch (errorMessage) {
      setError(errorMessage);
    }

    setIsSaving(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(activeService.id);
      setShowDeleteServiceModal(false);
      setTimeout(handleCloseSidePanel, 100);
    } catch (errorMessage) {
      setError(errorMessage);
    }
    setIsDeleting(false);
  }

  async function handleAddImage(selectedFiles) {
    if (selectedFiles[0].size > 1024 * 1024 * 20) {
      setError("You can only upload files smaller than 20MB.");
      return;
    }

    if (selectedFiles[0].type.indexOf("image") === -1) {
      setError("You can only upload image files.");
      return;
    }

    let files = new FormData();
    files.append("fileToUpload", selectedFiles[0]);

    setIsUploadingImage(true);

    try {
      const response = await postFile(`/api/v2/services/${activeService.id}/image`, files);
      const imagePath = response[0];
      const newServices = services.map(service => {
        if (service.id === activeService.id) {
          service.imagePath = imagePath;
        }
        return service;
      });
      onImageChange(newServices);
      setIsUploadingImage(false);
    } catch (errorMessage) {
      setError(errorMessage);
      setIsUploadingImage(false);
    }
  }

  async function handleDeleteImage() {
    setIsDeletingImage(true);
    setError(null);
    try {
      await remove(`/api/v2/services/${activeService.id}/image`);

      const newServices = services.map(service => {
        if (service.id === activeService.id) {
          service.imagePath = null;
        }
        return service;
      });
      setIsDeletingImage(false);
      onImageChange(newServices);
    } catch (errorMessage) {
      setIsDeletingImage(false);
      setError("There was an error deleting this file, please try again. If the problem persists, please contact us.");
    }
  }

  function renderDeleteModal() {
    return (
      <DeleteModal
        subjectName="Service"
        isVisible={showDeleteServiceModal}
        isPending={isDeleting}
        onClose={closeDeleteServiceModal}
        onDelete={handleDelete}
      />
    );
  }

  function renderSidePanel() {
    return (
      <SidePanel
        open={!!activeService}
        onOpen={() => {}}
        onClose={handleCloseSidePanel}
        heading="Edit Service"
        width="small"
      >
        {error && <Errors errors={[error]} onDismiss={() => setError(null)} />}
        <Tabs defaultActiveKey="details" id="servicesTab">
          <Tab title="Details" eventKey="details">
            {activeService && (
              <Details
                isSaving={isSaving}
                isDeleting={isDeletingImage}
                isUploading={isUploadingImage}
                onAddImage={handleAddImage}
                onDeleteImage={handleDeleteImage}
              />
            )}
            <div className="services__action-buttons">
              <PendingButton
                onClick={handleSave}
                disabled={isSaving}
                pending={isSaving}
                text="Save"
                pendingText="Saving..."
              />
              <PendingButton
                pending={isDeleting}
                disabled={isDeleting}
                onClick={() => {
                  setShowDeleteServiceModal(true);
                }}
                bsStyle="default"
                text="Delete"
                pendingText="Deleting..."
              />
            </div>
          </Tab>
          <Tab title="Pricing" eventKey="pricing">
            {activeService && <Pricing isSaving={isSaving} />}
            <div className="services__action-buttons">
              <PendingButton
                onClick={handleSave}
                disabled={isSaving}
                pending={isSaving}
                text="Save"
                pendingText="Saving..."
              />
            </div>
          </Tab>
        </Tabs>
      </SidePanel>
    );
  }

  return (
    <div className="services-page">
      {renderTable()}
      {renderDeleteModal()}
      {renderSidePanel()}
    </div>
  );
}

// This is here so can access 'activeService' on the main page and throughout the sidepanel.
// It could go in the context/provider file?
export function Services(props) {
  const [activeService, setActiveService] = React.useState(null);

  function updateActiveServiceDetails(field, newValue) {
    const newActiveService = produce(activeService, draftState => {
      draftState[field] = newValue;
    });
    setActiveService(newActiveService);
  }

  function updateZoneIsActive(zoneId, isActive) {
    const newActiveService = produce(activeService, draftState => {
      const zoneIndex = activeService.zones.findIndex(zone => zone.id === zoneId);
      draftState.zones[zoneIndex].isActive = isActive;
    });
    setActiveService(newActiveService);
  }

  function updateZonePrice(zoneId, newPrice) {
    const newActiveService = produce(activeService, draftState => {
      const zoneIndex = activeService.zones.findIndex(zone => zone.id === zoneId);
      draftState.zones[zoneIndex].rentalPrice = newPrice;
    });
    setActiveService(newActiveService);
  }

  return (
    <ServicesContext.Provider
      value={{ activeService, setActiveService, updateActiveServiceDetails, updateZoneIsActive, updateZonePrice }}
    >
      <ServicesWithContext {...props} />
    </ServicesContext.Provider>
  );
}

// This separates API call so can use Storybook
export default function ServicesWrapper() {
  const [services, setServices] = React.useState(null);

  React.useEffect(() => {
    document.title = "Services";
    getServices();
  }, []);

  async function getServices() {
    const services = await get("/api/v2/services");
    setServices(services);
  }

  async function handleSave(service) {
    await put(`/api/v2/services/${service.id}`, {
      title: service.title,
      description: service.description,
      extraCostPerDay: service.extraCostPerDay,
      includedDays: service.includedDays,
      size: service.size,
      zones: service.zones
    });

    await getServices();
  }

  async function handleDelete(serviceId) {
    await remove(`/api/v2/services/${serviceId}`);
    const _services = services.filter(service => service.id !== serviceId);
    setServices(_services);
  }

  function handleImageChange(services) {
    setServices(services);
  }

  return (
    <LoggedInStaffContext.Consumer>
      {loggedInStaff => {
        if (!loggedInStaff.pageAccess.manageServices) {
          return null;
        }

        return (
          <Services services={services} onSave={handleSave} onDelete={handleDelete} onImageChange={handleImageChange} />
        );
      }}
    </LoggedInStaffContext.Consumer>
  );
}
