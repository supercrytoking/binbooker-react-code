import React from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import ServicesContext from "../ServicesContext.jsx";
import Input from "Components/Input";
import Image from "../Image/Image.jsx";
import { FormGroup, InputGroup, FormControl, OverlayTrigger, Tooltip, Glyphicon } from "react-bootstrap";
import "react-quill/dist/quill.snow.css";
import "./Details.scss";

export default function ServiceDetails({ isSaving, isDeleting, isUploading, onAddImage, onDeleteImage }) {
  const { activeService, updateActiveServiceDetails } = React.useContext(ServicesContext);
  const { title, description, size, extraCostPerDay, includedDays } = activeService;

  const modules = {
    toolbar: [["underline", "italic", "bold", { list: "bullet" }]]
  };
  const allowedTags = ["bold", "italic", "underline", "list", "bullet"];

  const includedDaysTooltip = (
    <Tooltip id="tooltip-included-days">The number of days that are included in the base price.</Tooltip>
  );

  return (
    <div className="services__service-details">
      <Input
        disabled={isSaving}
        label="Title*"
        name="title"
        onChange={e => {
          updateActiveServiceDetails("title", e.target.value);
        }}
        value={title}
      />

      <FormGroup>
        <label htmlFor="description">Description</label>
        <ReactQuill
          readOnly={isSaving}
          value={description}
          onChange={str => {
            updateActiveServiceDetails("description", str);
          }}
          modules={modules}
          formats={allowedTags}
        />
      </FormGroup>

      <Input
        disabled
        label="Bin Size"
        name="size"
        type="number"
        onChange={e => {
          updateActiveServiceDetails("size", e.target.value);
        }}
        value={size}
      />

      <FormGroup controlId="includedDays">
        <label htmlFor="includedDays">
          Included days*
          <OverlayTrigger delayShow={500} placement="top" overlay={includedDaysTooltip}>
            <Glyphicon glyph="question-sign" />
          </OverlayTrigger>
        </label>
        <FormControl
          type="number"
          value={includedDays}
          onChange={e => {
            updateActiveServiceDetails("includedDays", e.target.value);
          }}
        />
      </FormGroup>

      <FormGroup controlId="extraCostPerDay">
        <label htmlFor="extraCostPerDay">Cost per additional day*</label>
        <InputGroup>
          <div className="input-group-addon">$</div>
          <FormControl
            type="number"
            value={extraCostPerDay}
            onChange={e => {
              updateActiveServiceDetails("extraCostPerDay", e.target.value);
            }}
          />
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <label>Image</label>
        <Image
          imagePath={activeService.imagePath}
          isDeleting={isDeleting}
          isUploading={isUploading}
          onAddImage={onAddImage}
          onDeleteImage={onDeleteImage}
        />
      </FormGroup>
    </div>
  );
}

ServiceDetails.propTypes = {
  isSaving: PropTypes.bool.isRequired
};
