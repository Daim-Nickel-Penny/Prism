import { Client } from "pg";
import crypto from "crypto";

import { IPatchSpacing, ISpacing, TSpacingUnit } from "../types/spacing";

/**
 * @param client - pg client
 * @param component_id - Reference ID used for retrieving particular record.
 * @returns {Promise<ISpacing>} - Resolves to spacing record for user or void in case of error.
 * @throws {Error} - in case of no component_id or no matching record.
 * @description - Retrieve specific component's spacing data. Called when a component is selected from layer tree.
 */
export const getSpacing = async (
  client: Client,
  component_id: string
): Promise<ISpacing> => {
  try {
    const { rows } = await client.query(
      `SELECT * FROM spacing_table WHERE component_id = $1`,
      [component_id]
    );
    if (!rows || rows.length <= 0) {
      throw new Error("no matching record found");
    }

    const record = rows[0];
    const spacing: ISpacing = {
      id: record.id,
      user_id: record.user_id,
      project_id: record.project_id,
      component_id: record.component_id,
      margin_top: { value: "auto", unit: "px" },
      margin_right: { value: "auto", unit: "px" },
      margin_bottom: { value: "auto", unit: "px" },
      margin_left: { value: "auto", unit: "px" },
      padding_top: { value: "auto", unit: "px" },
      padding_right: { value: "auto", unit: "px" },
      padding_bottom: { value: "auto", unit: "px" },
      padding_left: { value: "auto", unit: "px" },
    };

    /**
     * Loops over keys viz. margin_top_value etc.
     * Splits key name into 3 parts viz. margin, top, value
     * Joins 2 parts to get margin_top
     * if 3rd part is value, sets value of spacing object
     * else sets unit of spacing object
     */
    Object.keys(record).forEach((property) => {
      if (property.includes("margin") || property.includes("padding")) {
        const splittedProperty = property.split("_"); // margin_top_value -> margin, top, value
        const joinedKeyName = `${splittedProperty[0]}_${splittedProperty[1]}`; // margin_top
        if (splittedProperty[2] === "value") {
          spacing[joinedKeyName].value = record[property] as string;
        } else {
          spacing[joinedKeyName].unit = record[property] as TSpacingUnit;
        }
      }
    });

    return spacing;
  } catch (e) {
    throw e;
  }
};

/**
 * @param client - pg client
 * @param component_id - Reference ID used for retrieving particular record.
 * @param dataToBePatched - Spacing data to be patched.
 * @returns {Promise<string>} - Resolves to a success message or void in case of error.
 * @throws {Error} - in case of no component_id or no matching record or db patch failed.
 * @description - Patches or mutates specific component's any spacing data. Called when margin or padding values are changed.
 */
export const patchSpacing = async (
  client: Client,
  component_id: string,
  dataToBePatched: IPatchSpacing
): Promise<string> => {
  try {
    /**
     * Loops over keys viz. margin_top_value etc.
     * Uses flapMap because for each item, there has to be 2 return valus which are value and unit
     * Inside loop, at each iteration, check if value is object or not
     * if object, return value and unit appended to property [property + "_value", property + "_unit"]
     * else return property only [property]. This is for keys like component_id, user_id etc.
     */
    const columnNames = Object.keys(dataToBePatched).flatMap((property) => {
      if (typeof dataToBePatched[property] === "object") {
        return [property + "_value", property + "_unit"];
      }
      return property;
    });

    /**
     * Loops over keys viz. margin_top_value etc.
     * Uses flapMap because for each item, there has to be 2 return valus which are value and unit
     * Inside loop, at each iteration, check if value is object or not
     * if object, return value and unit appended to value 18 , px respectively
     * else return value. This is for keys like component_id, user_id etc.
     */
    let columnValues = Object.keys(dataToBePatched).flatMap((property) => {
      if (
        typeof dataToBePatched[property] === "object" &&
        dataToBePatched[property] !== undefined
      ) {
        return [
          dataToBePatched[property].value,
          dataToBePatched[property].unit,
        ];
      } else {
        return null;
      }
    });

    columnValues = columnValues.filter((eachValue) => eachValue !== null);

    let formatPatchQuery = `UPDATE spacing_table SET `;

    columnNames.forEach((name, index) => {
      formatPatchQuery += `${name}= $${index + 1}`;
      if (index < columnNames.length - 1) {
        formatPatchQuery += `, `;
      }
    });

    formatPatchQuery += `WHERE component_id = $${columnValues.length + 1} `;
    const patchQuery = {
      text: formatPatchQuery,
      values: [...columnValues, component_id],
    };

    const dbResponse = await client.query(patchQuery).catch((e) => {
      throw e;
    });

    return "success";
  } catch (e) {
    throw e;
  }
};

/**
 * @param client - pg client
 * @returns {Promise<string>} - Resolves to a success message providing user_id of newly created record or void in case of error.
 * @throws {Error} - in case of db post failed.
 * @description - Used to create an entry of spacing values with default data. Ideally, default spacing record will be created during user onboarding of the app.
 */
export const postSpacing = async (client: Client): Promise<string> => {
  try {
    const user_uuid = crypto["randomUUID"]();
    const project_uuid = crypto["randomUUID"]();
    const component_uuid = crypto["randomUUID"]();

    const defaultSpacingRecord: ISpacing = {
      user_id: user_uuid,
      project_id: project_uuid,
      component_id: component_uuid,
      margin_top: {
        value: "auto",
        unit: "px",
      },
      margin_right: {
        value: "auto",
        unit: "px",
      },
      margin_bottom: {
        value: "auto",
        unit: "px",
      },
      margin_left: {
        value: "auto",
        unit: "px",
      },
      padding_top: {
        value: "auto",
        unit: "px",
      },
      padding_right: {
        value: "auto",
        unit: "px",
      },
      padding_bottom: {
        value: "auto",
        unit: "px",
      },
      padding_left: {
        value: "auto",
        unit: "px",
      },
    };

    /**
     * Loops over keys viz. margin_top_value etc.
     * Uses flapMap because for each item, there has to be 2 return valus which are value and unit
     * Inside loop, at each iteration, check if value is object or not
     * if object, return value and unit appended to property [property + "_value", property + "_unit"]
     * else return property only [property]. This is for keys like component_id, user_id etc.
     */
    const columnNames = Object.keys(defaultSpacingRecord).flatMap(
      (property) => {
        if (typeof defaultSpacingRecord[property] === "object") {
          return [property + "_value", property + "_unit"];
        }
        return property;
      }
    );
    const columnIndexes = columnNames.map((key, index) => `$${index + 1}`);

    /**
     * Loops over keys viz. margin_top_value etc.
     * Uses flapMap because for each item, there has to be 2 return valus which are value and unit
     * Inside loop, at each iteration, check if value is object or not
     * if object, return value and unit appended to value 18 , px respectively
     * else return value. This is for keys like component_id, user_id etc.
     */
    const columnValues = Object.keys(defaultSpacingRecord).flatMap(
      (property) => {
        if (typeof defaultSpacingRecord[property] === "object") {
          return [
            defaultSpacingRecord[property].value,
            defaultSpacingRecord[property].unit,
          ];
        }
        return defaultSpacingRecord[property];
      }
    );

    const insertText = `INSERT INTO spacing_table(${columnNames.join(
      ", "
    )}) VALUES(${columnIndexes.join(", ")})`;

    const insertQuery = {
      text: insertText,
      values: [...columnValues],
    };

    console.log(insertQuery);

    const dbResponse = await client.query(insertQuery).catch((e) => {
      throw e;
    });

    return component_uuid;
  } catch (e) {
    throw e;
  }
};
