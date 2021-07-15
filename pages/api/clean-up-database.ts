import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      DELETE FROM SystemEvents
      WHERE Message = " >57"
      OR DeviceReportedTime < DATE_SUB(UTC_TIMESTAMP(),INTERVAL 60 DAY)
  `);
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
