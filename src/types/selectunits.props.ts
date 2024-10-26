import { TSpacingUnit } from "./spacingunit";

export interface SelectUnitsProps {
  unit: TSpacingUnit;
  onUnitChange: (newUnit: TSpacingUnit) => void;
  onInputFocus: () => void;
  isInputFocused: boolean;
}
