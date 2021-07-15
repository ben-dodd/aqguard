import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT ID,DeviceReportedTime,FromHost,Message FROM SystemEvents
      WHERE SysLogTag="13808<sendVal" AND Message <> " >57"
      ORDER BY DeviceReportedTime DESC
      LIMIT 10
  `);
    // AQ Guard sends 3 rows at a time
    // Get 10 most recent rows in case some values were in dropped packets

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
