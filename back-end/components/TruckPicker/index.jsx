import React from "react";
import { array, bool, func, number } from "prop-types";
import Spinner from "../Spinner";
import "./style.scss";

export default class TruckPicker extends React.Component {
  renderAllOption = () => {
    return this.props.includeAll ? <option value="">- All Trucks -</option> : null;
  };

  renderSelect = () => {
    if (this.props.trucks && this.props.trucks.length > 0) {
      return (
        <select
          className="form-control"
          name="truck"
          onChange={event => {
            this.props.onChange(event.target.value);
          }}
          defaultValue={this.props.activeTruckId}
        >
          {this.renderAllOption()}
          {this.props.trucks.map(truck => {
            return (
              <option value={truck.id} key={`truck${truck.id}`}>
                {truck.foreignId}
              </option>
            );
          })}
        </select>
      );
    }

    return <Spinner size="small" />;
  };

  render() {
    return <div className="truck-picker">{this.renderSelect()}</div>;
  }
}

TruckPicker.propTypes = {
  activeTruckId: number,
  includeAll: bool,
  onChange: func.isRequired,
  trucks: array
};

TruckPicker.defaultProps = {
  activeTruckId: 0,
  includeAll: true,
  trucks: []
};
