import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (_, res) => {
  try {
    const timezoneOffsetMinutes = new Date().getTimezoneOffset()
    const hours = Math.abs(Math.floor(timezoneOffsetMinutes / 60))
    const minutes = Math.abs(timezoneOffsetMinutes % 60)
    const sign = timezoneOffsetMinutes > 0 ? '-' : '+'

    // Construct the timezone offset string in the format '+HH:MM' or '-HH:MM'
    const timezoneOffsetString =
      sign +
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0')

    // console.log(timezoneOffsetMinutes, timezoneOffsetString)

    const results = await query(`
      SELECT * FROM (
        SELECT
          CONVERT_TZ(DeviceReportedTime, '+00:00', '${timezoneOffsetString}') AS DeviceReportedTime,
          Message
        FROM SystemEvents
        WHERE
          SysLogTag="13808<sendVal"
          AND Message <> " >57"
        ORDER BY
          DeviceReportedTime DESC
        LIMIT 5000
      ) AS log
      ORDER BY DeviceReportedTime ASC
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
