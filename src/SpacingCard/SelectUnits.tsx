import { useState } from "react";

import { SelectUnitsProps } from "../types/selectunits.props";
import { TSpacingUnit } from "../types/spacingunit";
import { CSS_SPACING_UNITS } from "../constants/css_spacing_units";

import "../styles/SpacingCard/SelectUnits.css";

/**
 * This component renders select box for each spacing property.
 * @param unit - Current unit value.
 * @param onUnitChange - Callback function to update unit value.
 * @param onInputFocus - Callback function to focus input field.
 * @param isInputFocused - Boolean value to indicate whether input field is focused or not.
 *
 * @returns  - React component rendering select box.
 */
const SelectUnits: React.FC<SelectUnitsProps> = ({
  unit,
  onUnitChange,
  onInputFocus,
  isInputFocused,
}) => {
  const [currentUnit, setCurrentUnit] = useState<TSpacingUnit>(unit);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  /**
   * This function handles unit change event.
   * @param e - Change event object.
   * @returns {void}
   */
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as TSpacingUnit;
    setCurrentUnit(newUnit);
    onUnitChange(newUnit);
  };

  return (
    <select
      name="units"
      className="select-units"
      onChange={handleUnitChange}
      value={currentUnit}
      onFocus={() => {
        onInputFocus();
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      style={{
        right: isInputFocused ? "-28%" : "-20%",
      }}
    >
      {CSS_SPACING_UNITS.map((eachCSSUnit, index) => (
        <option key={index} value={eachCSSUnit}>
          {eachCSSUnit}
        </option>
      ))}
    </select>
  );
};

export default SelectUnits;
