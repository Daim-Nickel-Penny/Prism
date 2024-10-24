import { useEffect, useRef, useState } from "react";
import "../styles/SpacingCard/Input.css";
import SelectUnits from "./SelectUnits";

const Input: React.FC = () => {
  const [value, setValue] = useState("180");
  const [isInputPristine, setIsInputPristine] = useState<boolean>(true);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value === "auto") {
      setIsInputPristine(true);
    } else {
      setIsInputPristine(false);
    }
  }, [value]);

  return (
    <div className="input-container ">
      <input
        ref={inputRef}
        className={`input-component `}
        type={"text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />

      {value === "auto" && !isInputFocused ? null : (
        <SelectUnits
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
