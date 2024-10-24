import { useState } from "react";
import "../styles/SpacingCard/SelectUnits.css";

type CSSSpacingUnit =
  | "px"
  | "pt"
  | "in"
  | "cm"
  | "mm"
  | "%"
  | "em"
  | "rem"
  | "vw"
  | "vh"
  | "vmin"
  | "vmax"
  | "ch"
  | "ex";

interface SelectUnitsProps {
  onInputFocus: () => void;
  isInputFocused: boolean;
}

const SelectUnits: React.FC<SelectUnitsProps> = ({
  onInputFocus,
  isInputFocused,
}) => {
  const [currentUnit, setCurrentUnit] = useState<CSSSpacingUnit>("px");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  /**List of units to be displayed in the dropdown*/
  const CSS_SPACING_UNITS: CSSSpacingUnit[] = [
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

  return (
    <select
      name="units"
      className="select-units"
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
