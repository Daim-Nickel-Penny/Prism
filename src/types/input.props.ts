import { ISpacingProperty } from "./spacing";
import { TSpacingUnit } from "./spacingunit";

export interface InputProps {
  key: string;
  identifier: string;
  spacingProperty: ISpacingProperty;
  updateSpacingData?: ({
    propertyKey,
    value,
    unit,
  }: {
    propertyKey: string;
    value: string;
    unit: TSpacingUnit;
  }) => void;
}
