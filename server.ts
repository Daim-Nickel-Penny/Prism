import "dotenv/config";
import { Client } from "pg";
import { backOff } from "exponential-backoff";
import express from "express";
import waitOn from "wait-on";
import onExit from "signal-exit";
import cors from "cors";
import { ISpacing } from "./types/spacing";

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
   * @param {string} _req.query.user_id - Refercence ID used for retrieving particular record.
   *
   * @returns {Promise<ISpacing | void>} - Resolves to spacing record for user or void in case of error.
   * @throws {Error} - in case of no user_id or no matching record.
   *
   * @description - Retrieve specific user's spacing data
   */

  app.get("/spacing", async (_req, res): Promise<ISpacing | void> => {
    try {
      const { user_id } = _req.query;

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
