/**
 * This type represents spacing unit.
 * @description - Supported units are "px", "pt", "in", "cm", "mm", "%", "em", "rem", "vw", "vh", "vmin", "vmax", "ch", "ex".
 */
export type TSpacingUnit =
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

/**
 * This interface represents spacing property.
 * @param value - Value of spacing property.
 * @param unit - Unit of spacing property.
 * @typeDef TSpacingUnit - Spacing unit type.
 */
interface ISpacingProperty {
  value: string;
  unit: TSpacingUnit;
}

/**
 * This interface represents spacing data.
 * @param id - Primary key.
 * @param user_id - User ID.
 * @param project_id - Project ID.
 * @param component_id - Component ID.
 * @param margin_top - Top margin property.
 * @param margin_right - Right margin property.
 * @param margin_bottom - Bottom margin property.
 * @param margin_left - Left margin property.
 * @param padding_top - Top padding property.
 * @param padding_right - Right padding property.
 * @param padding_bottom - Bottom padding property.
 * @param padding_left - Left padding property.
 * @typeDef TSpacingUnit - Spacing unit type.
 * @typeDef ISpacingProperty - Spacing property type.
 */
export interface ISpacing {
  id?: number;
  user_id: string;
  project_id: string;
  component_id: string;
  margin_top: ISpacingProperty;
  margin_right: ISpacingProperty;
  margin_bottom: ISpacingProperty;
  margin_left: ISpacingProperty;
  padding_top: ISpacingProperty;
  padding_right: ISpacingProperty;
  padding_bottom: ISpacingProperty;
  padding_left: ISpacingProperty;
}

export type IPatchSpacing = Partial<ISpacing>;
