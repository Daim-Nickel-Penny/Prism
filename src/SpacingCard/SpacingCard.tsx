import { useEffect, useRef, useState } from "react";

import Input from "./Input";

import { SPACING_BACKEND_URL } from "../constants/config";
import { TSpacingUnit } from "../types/spacingunit";
import { ISpacing, ISpacingProperty } from "../types/spacing";

import "../styles/SpacingCard/SpacingCard.css";

const SpacingCard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [spacingData, setSpacingData] = useState<ISpacing>();
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [componentId, setComponentId] = useState<string>(
    localStorage.getItem("ls_componentId") || ""
  );

  const fetchSpacingData = async (
    serverComponentId?: string
  ): Promise<ISpacing | null> => {
    try {
      const options = {
        method: "GET",
      };

      const payloadComponentId = serverComponentId || componentId;

      const endpoint = SPACING_BACKEND_URL + "/" + payloadComponentId;

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

  const sendNewProjectRequest = async (): Promise<string> => {
    setLoading(true);

    try {
      const options = {
        method: "POST",
      };
      const endpoint = SPACING_BACKEND_URL;
      const serverResponse = await fetch(endpoint, options)
        .then((res) => res.json())
        .catch((e) => {
          throw e;
        });

      if (serverResponse === undefined) {
        throw new Error("server response is undefined");
      }

      const responseComponentId: string = serverResponse.component_id;
      if (responseComponentId === undefined) {
        throw new Error("response component id is undefined");
      }
      console.log(serverResponse);
      console.log(responseComponentId);

      localStorage.setItem("ls_componentId", responseComponentId);
      setComponentId(responseComponentId);

      const data: ISpacing | null = await fetchSpacingData(responseComponentId);
      if (data !== null) {
        setSpacingData(data);
      } else {
        throw new Error("No valid data received");
      }

      return responseComponentId;
    } catch (e) {
      console.error("Error in Creating New Project");
      console.error(e);
      alert("Sevrer failed to create new project");
      throw e;
    } finally {
      setLoading(false);
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

      const endpoint = SPACING_BACKEND_URL + "/" + componentId;

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
    try {
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
    } catch (e) {
      console.error("Error in fetching spacing data");
      console.error(e);
      alert("Sevrer failed to create new project");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading.....</div>
      ) : (
        <>
          {spacingData ? (
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
          ) : (
            <div className="spacing-card-new-project-btn-wrapper">
              <button
                className="spacing-card-new-project-btn"
                onClick={(e) => {
                  e.preventDefault();
                  sendNewProjectRequest();
                }}
              >
                + New Project
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SpacingCard;
