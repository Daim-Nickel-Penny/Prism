// %raw(`require("../styles/SpacingCard/SelectUnits.css")`)

// type tSpacingUnit = [
//   | #ch
//   | #cm
//   | #em
//   | #ex
//   | #"in"
//   | #mm
//   | #percent
//   | #pt
//   | #px
//   | #rem
//   | #vh
//   | #vmax
//   | #vmin
//   | #vw
// ]

// // Function to convert tSpacingUnit to string
// let tSpacingUnitToString = (unit: tSpacingUnit): string =>
//   switch unit {
//   | #px => "px"
//   | #pt => "pt"
//   | #"in" => "in"
//   | #cm => "cm"
//   | #mm => "mm"
//   | #percent => "%"
//   | #em => "em"
//   | #rem => "rem"
//   | #vw => "vw"
//   | #vh => "vh"
//   | #vmin => "vmin"
//   | #vmax => "vmax"
//   | #ch => "ch"
//   | #ex => "ex"
//   }

// // Function to convert string to tSpacingUnit
// let stringToTSpacingUnit = (str: string): option<tSpacingUnit> =>
//   switch str {
//   | "px" => Some(#px)
//   | "pt" => Some(#pt)
//   | "in" => Some(#"in")
//   | "cm" => Some(#cm)
//   | "mm" => Some(#mm)
//   | "%" => Some(#percent)
//   | "em" => Some(#em)
//   | "rem" => Some(#rem)
//   | "vw" => Some(#vw)
//   | "vh" => Some(#vh)
//   | "vmin" => Some(#vmin)
//   | "vmax" => Some(#vmax)
//   | "ch" => Some(#ch)
//   | "ex" => Some(#ex)
//   | _ => None // Handle unexpected strings
//   }

// // Define props for the SelectUnits component
// type selectUnitsProps = {
//   unit: string,
//   onUnitChange: tSpacingUnit => unit,
//   onInputFocus: unit => unit,
//   isInputFocused: bool,
// }

// @react.component
// let make = (~unit, ~onUnitChange, ~onInputFocus, ~isInputFocused) => {
//   // State Hooks
//   let (currentUnit, setCurrentUnit) = React.useState(() => unit)
//   let (isFocused, setIsFocused) = React.useState(() => false)

//   // CSS Spacing Units - ensure all items are of type tSpacingUnit
//   let cssSpacingUnits: array<tSpacingUnit> = [
//     #px,
//     #pt,
//     #"in",
//     #cm,
//     #mm,
//     #percent,
//     #em,
//     #rem,
//     #vw,
//     #vh,
//     #vmin,
//     #vmax,
//     #ch,
//     #ex,
//   ]

//   // Event Handler for changing the unit
//   let handleUnitChange = event => {
//     let newUnitStr = ReactEvent.Form.target(event)["value"]
//     switch stringToTSpacingUnit(newUnitStr) {
//     | Some(newUnit) => {
//         setCurrentUnit(_ => newUnit)
//         onUnitChange(newUnit)
//       }
//     | None => () // Handle error if necessary
//     }
//   }

//   // JSX Render
//   <select
//     name="units"
//     className="select-units"
//     onChange=handleUnitChange
//     value={currentUnit->tSpacingUnitToString}
//     onFocus={_ => {
//       onInputFocus()
//       setIsFocused(_ => true)
//     }}
//     onBlur={_ => setIsFocused(_ => false)}
//     style={ReactDOM.Style.make(~right=isInputFocused ? "-28%" : "-20%", ())}>
//     {React.array(
//       Array.map(
//         eachCSSUnit =>
//           <option key={tSpacingUnitToString(eachCSSUnit)} value={tSpacingUnitToString(eachCSSUnit)}>
//             {React.string(tSpacingUnitToString(eachCSSUnit)->Js.String2.toUpperCase)}
//           </option>,
//         cssSpacingUnits,
//       ),
//     )}
//   </select>
// }

