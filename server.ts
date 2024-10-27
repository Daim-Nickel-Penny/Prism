import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express, { text } from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";

import {
  IPatchSpacing,
  ISpacing,
  ISpacingProperty,
  TSpacingUnit,
} from "./types/spacing";
import {
  getSpacing,
  patchSpacing,
  postSpacing,
} from "./services/spacing.service";

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
   * Preconditions:
   * - component_id is available in the database
   * - if not, use the post route to create a new record
   *
   * @param {string} _req.params.component_id - Refercence ID used for retrieving particular record.
   *
   * @returns {Promise<ISpacing | void>} - Resolves to spacing record for user or void in case of error.
   * @throws {Error} - in case of no component_id or no matching record.
   *
   * @pre
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

        const spacing = await getSpacing(client, component_id);

        res.status(200).json(spacing);

        return spacing;
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
   * @param {IPatchSpacing} _req.body - Spacing data to be patched.
   * @returns {Promise<string | void>} - Resolves to a success message or void in case of error.
   * @throws {Error} - in case of no component_id or no matching record or db patch failed.
   *
   * @description - Patches or mutates specific component's any spacing data. Called when margin or padding values are changed.
   */
  app.patch(
    "/spacing/:component_id",
    async (_req, res): Promise<string | void> => {
      try {
        console.log("Patching/Updating Data");
        const { component_id } = _req.params;
        if (!component_id) {
          throw new Error("component_id is not found");
        }

        const dataToBePatched: IPatchSpacing = _req.body;
        if (!dataToBePatched) {
          throw new Error("data to be patched is not found");
        }

        const serviceResponse: string = await patchSpacing(
          client,
          component_id,
          dataToBePatched
        );

        res
          .status(200)
          .json({ message: "fields patched/updated successfully" });

        return serviceResponse;
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
      const serviceResponse: string = await postSpacing(client);

      res.status(200).json({
        component_id: serviceResponse,
      });
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
