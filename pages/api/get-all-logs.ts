import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (_, res) => {
  try {
    const results = await query(`
    SELECT * FROM (
      SELECT 
          ID,
          CONVERT_TZ(DeviceReportedTime, 'GMT', 'NZ') AS DeviceReportedTime_NZ,
          FromHost,
          Message 
      FROM 
          SystemEvents
      WHERE 
          SysLogTag="13808<sendVal" 
          AND Message <> " >57"
      ORDER BY 
          DeviceReportedTime DESC
      LIMIT 100
  ) AS log
  ORDER BY 
      DeviceReportedTime_NZ ASC
  `)

    // Add LIMIT 9 to reduce results

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler

// DATABASE CLEAN UP
// DELETE FROM SystemEvents
// WHERE Message = " >57"
// OR DeviceReportedTime < DATE_SUB(UTC_TIMESTAMP(),INTERVAL 60 DAY)

// TIME BASED QUERY
// SELECT ID,DeviceReportedTime,FromHost,Message,SysLogTag,ReceivedAt FROM SystemEvents
// WHERE SysLogTag="13808<sendVal" AND Message <> " >57"
// AND DeviceReportedTime >= DATE_SUB(UTC_TIMESTAMP(),INTERVAL 7 DAY)
// ORDER BY DeviceReportedTime DESC

// INTERVAL 7 DAY		Get data from the last week
// INTERVAL 1 HOUR		Get data from the last hour
// INTERVAL 10 MINUTE	Get data from the last ten minutes
// INTERVAL 30 SECOND	Get data from the last 30 seconds
