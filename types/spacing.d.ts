export interface ISpacing {
  id?: number;
  user_id: string;
  margin_top: string;
  margin_right: string;
  margin_bottom: string;
  margin_left: string;
  padding_top: string;
  padding_right: string;
  padding_bottom: string;
  padding_left: string;
}

export type IPatchSpacing = Partial<ISpacing>;
