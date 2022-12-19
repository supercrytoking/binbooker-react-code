import React from "react";
import { array, func } from "prop-types";

export default class ActiveTruckProvider extends React.Component {
  static propTypes = {
    render: func.isRequired,
    trucks: array
  };

  static defaultProps = {
    trucks: []
  };

  state = {
    activeTruckId: null
  };

  componentDidMount() {
    this.activateFirstTruck();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.trucks !== this.props.trucks) {
      this.activateFirstTruck();
    }
  }

  activateFirstTruck = () => {
    if (this.props.trucks && this.props.trucks.length > 0) {
      this.setState({ activeTruckId: this.props.trucks[0].id });
    }
  };

  onChangeTruck = truckId => {
    this.setState({ activeTruckId: truckId });
  };

  render() {
    return this.props.render(this.state.activeTruckId, this.onChangeTruck);
  }
}
