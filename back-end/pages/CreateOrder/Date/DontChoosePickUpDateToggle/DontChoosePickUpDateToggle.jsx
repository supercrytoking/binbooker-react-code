import React from "react";
import PropTypes from "prop-types";
import "./DontChoosePickUpDateToggle.scss";

export default function DontChoosePickUpDateToggle({ isChecked, onClick }) {
  return (
    <div className="date__dont-choose-pick-up">
      <label>
        <input type="checkbox" checked={isChecked} onChange={onClick} />
        &nbsp; Do not choose a pick-up date at this time
      </label>
    </div>
  );
}

DontChoosePickUpDateToggle.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
