import React, { useEffect, useRef, useState } from "react";
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
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [componentId, setComponentId] = useState<string>(
    "070a7702-a1e0-4702-a599-dcbebaee7fc3"
  );

  const fetchSpacingData = async (): Promise<ISpacing | null> => {
    try {
      const options = {
        method: "GET",
      };

      const endpoint = "http://localhost:12346/spacing/" + componentId;

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

  const updateSpacingData = ({
    propertyKey,
    value,
    unit,
  }: {
    propertyKey: string;
    value: string;
    unit: TSpacingUnit;
  }) => {
    // propertyKey = "margin_top"; value = "17"; unit = "px";

    const updatedProperty: ISpacingProperty = {
      value,
      unit,
    };

    if (!spacingData) {
      return;
    }

    const newSpacingData = {
      ...spacingData,
      [propertyKey]: updatedProperty,
    };

    setSpacingData(newSpacingData);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      sendSpacingData();
      window.onbeforeunload = null;
    }, 8000);
    window.onbeforeunload = () => "Unsaved changes to cloud";
  };

  const sendSpacingData = () => {
    try {
      if (spacingData === undefined) {
        throw new Error("Spacing data is undefined");
      }

      //delete id, component_id, user_id, project_id
      const patchedData: Partial<ISpacing> = {
        margin_top: spacingData.margin_top,
        margin_right: spacingData.margin_right,
        margin_bottom: spacingData.margin_bottom,
        margin_left: spacingData.margin_left,
        padding_top: spacingData.padding_top,
        padding_right: spacingData.padding_right,
        padding_bottom: spacingData.padding_bottom,
        padding_left: spacingData.padding_left,
      };
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchedData),
      };

      const endpoint = "http://localhost:12346/spacing/" + componentId;

      const serverUpdateResponse = fetch(endpoint, options).then((response) =>
        response.json()
      );
    } catch (e) {
      console.error("Error in sending spacing data");
      console.error(e);
      alert("Save failed due to an error");
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
                    identifier={"margin_top"}
                    spacingProperty={spacingData.margin_top}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div2">
                  {/*outer-left */}
                  <Input
                    key={"margin_left"}
                    identifier={"margin_left"}
                    spacingProperty={spacingData.margin_left}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div3">
                  {/*outer-bottom*/}
                  <Input
                    key={"margin_bottom"}
                    identifier={"margin_bottom"}
                    spacingProperty={spacingData.margin_bottom}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div4">
                  {/*outer-right*/}
                  <Input
                    key={"margin_right"}
                    identifier={"margin_right"}
                    spacingProperty={spacingData.margin_right}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="inner-rectangle">{/*rectangle */}</div>
                <div className="div6">
                  {/*inner-top */}
                  <Input
                    key={"padding_top"}
                    identifier={"padding_top"}
                    spacingProperty={spacingData.padding_top}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div7">
                  {/*inner-left */}
                  <Input
                    key={"padding_left"}
                    identifier={"padding_left"}
                    spacingProperty={spacingData.padding_left}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div8">
                  {/* inner-bottom */}
                  <Input
                    key={"padding_bottom"}
                    identifier={"padding_bottom"}
                    spacingProperty={spacingData.padding_bottom}
                    updateSpacingData={updateSpacingData}
                  />
                </div>
                <div className="div9">
                  {/* inner-right */}
                  <Input
                    key={"padding_right"}
                    identifier={"padding_right"}
                    spacingProperty={spacingData.padding_right}
                    updateSpacingData={updateSpacingData}
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
