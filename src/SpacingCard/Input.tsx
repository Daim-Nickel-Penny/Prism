import { useEffect, useRef, useState } from "react";
import "../styles/SpacingCard/Input.css";
import SelectUnits from "./SelectUnits";

const Input: React.FC = () => {
  const [value, setValue] = useState("18");
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
        className={`input-component ${
          isInputPristine
            ? "input-component-pristine"
            : "input-component-updated"
        } `}
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
    </div>
  );
};

export default Input;
