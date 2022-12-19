import React from "react";
import { useDebouncedCallback } from "use-debounce";
import FilterBar from "Components/FilterBar";
import ToggleSwitch from "Components/ToggleSwitch";

export default function SearchBar({
  defaultFilterString,
  defaultShowUnpaidOnly,
  onChangeFilterString,
  onChangeShowUnpaidOnly
}) {
  const [filterString, setFilterString] = React.useState(defaultFilterString);
  const [showUnpaidOnly, setShowUnpaidOnly] = React.useState(defaultShowUnpaidOnly);

  React.useEffect(() => {
    debouncedHandleChangeFilter();
  }, [filterString]);

  React.useEffect(() => {
    onChangeShowUnpaidOnly(showUnpaidOnly);
  }, [showUnpaidOnly]);

  const debouncedHandleChangeFilter = useDebouncedCallback(() => {
    onChangeFilterString(filterString);
  }, 500);

  return (
    <div className="orders-filter-wrapper">
      <div className="orders-filter-wrapper__filter">
        <FilterBar
          placeholder="Filter Orders..."
          onChange={e => {
            setFilterString(e.target.value);
          }}
          value={filterString}
        />
      </div>
      <div className="orders-filter-wrapper__toggle">
        <ToggleSwitch
          id="invoiced-orders-only"
          isChecked={showUnpaidOnly}
          isSmall
          onChange={() => {
            setShowUnpaidOnly(oldValue => !oldValue);
          }}
        />
        <div>Show unpaid only</div>
      </div>
    </div>
  );
}
