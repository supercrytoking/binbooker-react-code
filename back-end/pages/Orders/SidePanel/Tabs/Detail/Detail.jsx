import React from "react";
import Avatar from "Components/Avatar";
import Input from "Components/Input";
import PropTypes from "prop-types";
import moment from "moment";
import "./Detail.scss";

export default function Detail({ createdBy, createdOn }) {
  return (
    <div className="sidepanel__detail-tab">
      <div className="form-group">
        <label>Created by</label>
        <br />
        <div className="detail-tab__avatar-wrapper">
          <Avatar name={createdBy} />
          <div className="detail-tab__created-by">{createdBy}</div>
        </div>
      </div>
      <Input
        disabled
        name="createdOn"
        label="Created on"
        value={moment(createdOn).format("dddd, MMMM D, YYYY h:mm A")}
        onChange={() => {}}
      />
    </div>
  );
}

Detail.propTypes = {
  createdBy: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired
};
