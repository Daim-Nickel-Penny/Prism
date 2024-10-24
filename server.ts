import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express, { text } from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";
import crypto from "crypto";

import { IPatchSpacing, ISpacing } from "./types/spacing";

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
   * @param {string} _req.params.user_id - Refercence ID used for retrieving particular record.
   *
   * @returns {Promise<ISpacing | void>} - Resolves to spacing record for user or void in case of error.
   * @throws {Error} - in case of no user_id or no matching record.
   *
   * @description - Retrieve specific user's spacing data. Called when a component is selected from layer tree.
   */
  app.get("/spacing/:user_id", async (_req, res): Promise<ISpacing | void> => {
    try {
      const { user_id } = _req.params;
      if (!user_id) {
        throw new Error("user_id is not found");
      }

      const { rows } = await client.query(
        `SELECT * FROM spacing_table WHERE user_id = $1`,
        [user_id]
      );
      if (!rows || rows.length <= 0) {
        throw new Error("no matching record found");
      }

      const spacing: ISpacing = {
        id: rows[0].id,
        user_id: rows[0].user_id,
        margin_top: rows[0].margin_top,
        margin_bottom: rows[0].margin_bottom,
        margin_right: rows[0].margin_right,
        margin_left: rows[0].margin_left,
        padding_top: rows[0].padding_top,
        padding_right: rows[0].padding_right,
        padding_bottom: rows[0].padding_bottom,
        padding_left: rows[0].padding_left,
      };

      res.status(200).json(rows);

      return spacing;
    } catch (e) {
      console.error("Error in retrieving spacing table record.");
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  /**
   * @route PATCH /spacing
   *
   * @param {string} _req.params.user_id - Reference ID used for retrieving particular record.
   *
   * @returns {Promise<string | void>} - Resolves to a success message or void in case of error.
   * @throws {Error} - in case of no user_id or no matching record or db patch failed.
   *
   * @description - Patches or mutates specific user's any spacing data. Called when margin or padding values are changed.
   */
  app.patch("/spacing/:user_id", async (_req, res): Promise<string | void> => {
    try {
      const { user_id } = _req.params;
      if (!user_id) {
        throw new Error("user_id is not found");
      }

      const dataToBePatched: IPatchSpacing = _req.body;
      if (!dataToBePatched) {
        throw new Error("data to be patched is not found");
      }

      const patchedValues: string[] = [];
      const propertyNamesToBePatched = Object.keys(dataToBePatched);
      let formatPatchQueryValues = propertyNamesToBePatched.map(
        (eachProperty, index) => {
          if (dataToBePatched[eachProperty] !== undefined) {
            patchedValues.push(dataToBePatched[eachProperty]);
            return `${eachProperty} = $${index + 1}`;
          } else {
            return null;
          }
        }
      );
      formatPatchQueryValues = formatPatchQueryValues.filter(
        (entry) => entry !== null
      );

      const formatPatchQuery = `UPDATE spacing_table SET ${formatPatchQueryValues.join(
        ", "
      )} WHERE user_id = $${formatPatchQueryValues.length + 1}`;

      const patchQuery = {
        text: formatPatchQuery,
        values: [...patchedValues, user_id],
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
  });

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
      const uuid = crypto["randomUUID"]();
      const defaultSpacingRecord: ISpacing = {
        user_id: uuid,
        margin_top: "auto",
        margin_right: "auto",
        margin_bottom: "auto",
        margin_left: "auto",
        padding_top: "auto",
        padding_right: "auto",
        padding_bottom: "auto",
        padding_left: "auto",
      };

      const columnNames = Object.keys(defaultSpacingRecord).map(
        (property) => property
      );
      const columnIndexes = columnNames.map((key, index) => `$${index + 1}`);
      const columnValues = columnNames.map(
        (key, index) => defaultSpacingRecord[key]
      );

      const insertText = `INSERT INTO spacing_table(${columnNames.join(
        ", "
      )}) VALUES(${columnIndexes.join(", ")})`;

      const insertQuery = {
        text: insertText,
        values: [...columnValues],
      };

      const dbResponse = await client.query(insertQuery).catch((e) => {
        throw e;
      });

      res.status(200).json({
        message: `record created successfully with user_id = ${defaultSpacingRecord.user_id} `,
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
