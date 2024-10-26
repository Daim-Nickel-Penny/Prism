export interface ISpacingProperty {
  value: string;
  unit: TSpacingUnit;
}

interface ISpacing {
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
