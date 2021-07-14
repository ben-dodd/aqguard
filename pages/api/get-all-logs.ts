import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
      SELECT ID,DeviceReportedTime,FromHost,Message,SysLogTag,ReceivedAt FROM SystemEvents
      ORDER BY DeviceReportedTime DESC
  `);

    // Add LIMIT 9 to reduce results

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;