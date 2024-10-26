import { ISpacingProperty } from "./spacing";
import { TSpacingUnit } from "./spacingunit";

/**
 * This interface represents input props for each spacing property.
 * @param key - Unique key for each input field.
 * @param identifier - Identifier which has same value as key. Used for formatting patch request body
 *                     e.g identifier = "margin_top", used as "margin_top_value"  and "margin_top_unit" in patch request.
 * @param spacingProperty - Spacing property object.
 * @param updateSpacingData - Callback function to update spacing property value.
 *
 */

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
