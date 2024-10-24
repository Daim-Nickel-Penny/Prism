import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express, { text } from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";
import crypto from "crypto";

import {
  IPatchSpacing,
  ISpacing,
  ISpacingProperty,
  TSpacingUnit,
} from "./types/spacing";

// Add your routes here
const setupApp = (client: Client): express.Application => {
  const app: express.Application = express();

  app.use(cors());

  app.use(express.json());

  app.get("/examples", async (_req, res) => {
    const { rows } = await client.query(`SELECT * FROM example_table`);
    res.json(rows);
  });

  /**
   * @route GET /spacing
   *
   * @param {string} _req.params.component_id - Refercence ID used for retrieving particular record.
   *
   * @returns {Promise<ISpacing | void>} - Resolves to spacing record for user or void in case of error.
   * @throws {Error} - in case of no component_id or no matching record.
   *
   * @description - Retrieve specific component's spacing data. Called when a component is selected from layer tree.
   */
  app.get(
    "/spacing/:component_id",
    async (_req, res): Promise<ISpacing | void> => {
      try {
        const { component_id } = _req.params;
        if (!component_id) {
          throw new Error("component_id is not found");
        }

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

        res.status(200).json(spacing);

        return record;
      } catch (e) {
        console.error("Error in retrieving spacing table record.");
        console.error(e);
        res.status(500).json({ error: e.message });
      }
    }
  );

  /**
   * @route PATCH /spacing
   *
   * @param {string} _req.params.component_id - Reference ID used for retrieving particular record.
   *
   * @returns {Promise<string | void>} - Resolves to a success message or void in case of error.
   * @throws {Error} - in case of no component_id or no matching record or db patch failed.
   *
   * @description - Patches or mutates specific component's any spacing data. Called when margin or padding values are changed.
   */
  app.patch(
    "/spacing/:component_id",
    async (_req, res): Promise<string | void> => {
      try {
        const { component_id } = _req.params;
        if (!component_id) {
          throw new Error("component_id is not found");
        }

        const dataToBePatched: IPatchSpacing = _req.body;
        if (!dataToBePatched) {
          throw new Error("data to be patched is not found");
        }

        const columnNames = Object.keys(dataToBePatched).flatMap((property) => {
          if (typeof dataToBePatched[property] === "object") {
            return [property + "_value", property + "_unit"];
          }
          return property;
        });
        const columnIndexes = columnNames.map((key, index) => `$${index + 1}`);
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

        const formatPatchQuery = `UPDATE spacing_table SET ${columnValues.join(
          ", "
        )} WHERE component_id = $${columnValues.length + 1}`;

        const patchQuery = {
          text: formatPatchQuery,
          values: [...columnValues, component_id],
        };

        const dbResponse = await client.query(patchQuery).catch((e) => {
          throw e;
        });

        res.status(200).json({ message: "fields updated successfully" });

        return "success";
      } catch (e) {
        console.error("Error in patching spacing table record.");
        console.error(e);

        res.status(500).json({ error: e.message });
      }
    }
  );

  /**
   * @route POST /spacing
   *
   * @returns {Promise<string | void>} - Resolves to a success message providing user_id of newly created record or void in case of error.
   * @throws {Error} - in case of db post failed.
   *
   * @description - Used to create an entry of spacing values with default data. Ideally, default spacing record will be created during user onboarding of the app.
   */
  app.post("/spacing", async (_req, res): Promise<string | void> => {
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

      const columnNames = Object.keys(defaultSpacingRecord).flatMap(
        (property) => {
          if (typeof defaultSpacingRecord[property] === "object") {
            return [property + "_value", property + "_unit"];
          }
          return property;
        }
      );
      const columnIndexes = columnNames.map((key, index) => `$${index + 1}`);
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

      res.status(200).json({
        message: `record created successfully with component id = ${defaultSpacingRecord.component_id} `,
      });

      return "success";
    } catch (e) {
      console.error("Error in creating spacing table record.");
      console.error(e);

      res.status(500).json({ error: e.message });
    }
  });

  return app;
};

// Waits for the database to start and connects
const connect = async (): Promise<Client> => {
  console.log("Connecting");
  const resource = `tcp:${process.env.PGHOST}:${process.env.PGPORT}`;
  console.log(`Waiting for ${resource}`);
  await waitOn({ resources: [resource] });
  console.log("Initializing client");
  const client = new Client();
  await client.connect();
  console.log("Connected to database");

  // Ensure the client disconnects on exit
  onExit(async () => {
    console.log("onExit: closing client");
    await client.end();
  });

  return client;
};

const main = async () => {
  const client = await connect();
  const app = setupApp(client);
  const port = parseInt(process.env.SERVER_PORT || "12348");
  app.listen(port, () => {
    console.log(
      `Draftbit Coding Challenge is running at http://localhost:${port}/`
    );
  });
};

main();
