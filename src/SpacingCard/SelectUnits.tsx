import { useState } from "react";
import "../styles/SpacingCard/SelectUnits.css";
import { ISpacingProperty, TSpacingUnit } from "./SpacingCard";

interface SelectUnitsProps {
  unit: TSpacingUnit;
  onUnitChange: (newUnit: TSpacingUnit) => void;
  onInputFocus: () => void;
  isInputFocused: boolean;
}

const SelectUnits: React.FC<SelectUnitsProps> = ({
  unit,
  onUnitChange,
  onInputFocus,
  isInputFocused,
}) => {
  const [currentUnit, setCurrentUnit] = useState<TSpacingUnit>(unit);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  /**List of units to be displayed in the dropdown*/
  const CSS_SPACING_UNITS: TSpacingUnit[] = [
    "px",
    "pt",
    "in",
    "cm",
    "mm",
    "%",
    "em",
    "rem",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "ch",
    "ex",
  ];

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
