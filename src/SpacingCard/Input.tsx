import { useEffect, useRef, useState } from "react";

import SelectUnits from "./SelectUnits";
import { TSpacingUnit } from "../types/spacingunit";
import { InputProps } from "../types/input.props";

import "../styles/SpacingCard/Input.css";

const Input: React.FC<InputProps> = ({
  key,
  identifier,
  spacingProperty,
  updateSpacingData,
}) => {
  const [value, setValue] = useState<string>(spacingProperty.value || "auto");
  const [unit, setUnit] = useState<TSpacingUnit>(spacingProperty.unit || "px");

  const [isInputPristine, setIsInputPristine] = useState<boolean>(true);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const modifySpacingData = (new_value: string, new_unit: TSpacingUnit) => {
    try {
      spacingProperty.value = new_value;
      spacingProperty.unit = new_unit;

      setUnit(new_unit);
      updateSpacingData?.({
        propertyKey: identifier,
        value: new_value,
        unit: new_unit,
      });
    } catch (e) {
      console.log("Error modifying spacing data");
      console.log(e);
    }
  };

  useEffect(() => {
    if (value === "auto") {
      setIsInputPristine(true);
    } else {
      setIsInputPristine(false);
    }
  }, [value]);

  return (
    <div
      className="input-container"
      key={key}
      style={{
        width: `${Math.max(54, value.length * 15)}px`,
      }}
    >
      <input
        ref={inputRef}
        className={`input-component `}
        type={"text"}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          modifySpacingData(e.target.value, unit);
        }}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />

      {value === "auto" && !isInputFocused ? null : (
        <SelectUnits
          unit={unit}
          onUnitChange={(newUnit) => modifySpacingData(value, newUnit)}
          onInputFocus={() => inputRef.current?.focus()}
          isInputFocused={isInputFocused}
        />
      )}

      {isInputPristine ? (
        <></>
      ) : (
        !isInputFocused && <div className="input-component-updated"></div>
      )}
    </div>
  );
};

export default Input;
