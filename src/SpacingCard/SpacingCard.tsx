import React, { useEffect, useState } from "react";
import Input from "./Input";
import "../styles/SpacingCard/SpacingCard.css";

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
const SpacingCard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [spacingData, setSpacingData] = useState<ISpacing>();

  const fetchSpacingData = async (): Promise<ISpacing | null> => {
    try {
      const options = {
        method: "GET",
      };

      const endpoint =
        "http://localhost:12346/spacing/99b1cd86-99a2-4183-98db-28b1efaabd4b";

      const serverResponse = await fetch(endpoint, options).then((response) =>
        response.json()
      );

      if (
        serverResponse !== undefined &&
        Object.keys(serverResponse).length > 1
      ) {
        return serverResponse;
      } else {
        return null;
      }
    } catch (e) {
      console.error("Error in fetching spacing data");
      console.error(e);

      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchWrapper = async () => {
      const data: ISpacing | null = await fetchSpacingData();
      if (data !== null) {
        setSpacingData(data);
      } else {
        console.warn("No valid data received");
      }

      setLoading(false);
    };
    fetchWrapper();
  }, []);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <>
          {spacingData && (
            <>
              <div className="card-container">
                <div className="div1">
                  {/*outer-top */}
                  <Input
                    key={"margin_top"}
                    spacingProperty={spacingData.margin_top}
                  />
                </div>
                <div className="div2">
                  {/*outer-left */}
                  <Input
                    key={"margin_left"}
                    spacingProperty={spacingData.margin_left}
                  />
                </div>
                <div className="div3">
                  {/*outer-bottom*/}
                  <Input
                    key={"margin_bottom"}
                    spacingProperty={spacingData.margin_bottom}
                  />
                </div>
                <div className="div4">
                  {/*outer-right*/}
                  <Input
                    key={"margin_right"}
                    spacingProperty={spacingData.margin_right}
                  />
                </div>
                <div className="inner-rectangle">{/*rectangle */}</div>
                <div className="div6">
                  {/*inner-top */}
                  <Input
                    key={"padding_top"}
                    spacingProperty={spacingData.padding_top}
                  />
                </div>
                <div className="div7">
                  {/*inner-left */}
                  <Input
                    key={"padding_left"}
                    spacingProperty={spacingData.padding_left}
                  />
                </div>
                <div className="div8">
                  {/* inner-bottom */}
                  <Input
                    key={"padding_bottom"}
                    spacingProperty={spacingData.padding_bottom}
                  />
                </div>
                <div className="div9">
                  {/* inner-right */}
                  <Input
                    key={"padding_right"}
                    spacingProperty={spacingData.padding_right}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default SpacingCard;
