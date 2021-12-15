import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { job_id } = req.query;
  try {
    const results = await query(
      `
      SELECT
        activity.id AS activity_id,
      	activity.name AS activity_name,
        sds.id AS sds_id,
      	sds.name AS sds_name,
      	activity_sds.amount_normal AS sds_normal_amount,
      	activity_sds.amount_upper AS sds_upper_amount,
        substance.id AS substance_id,
      	substance.name AS substance_name,
      	substance.cas AS substance_cas,
      	sds_substance.lower_limit AS substance_lower_limit,
      	sds_substance.upper_limit AS substance_upper_limit,
        standard.id AS standard_id,
      	standard.limit AS standard_limit,
      	standard.unit AS standard_unit,
      	type.name AS standard_type_name,
      	organisation.name AS standard_organisation_name,
      	standard.year AS standard_year
      FROM activity
      LEFT JOIN activity_sds
      ON activity.id = activity_sds.activity_id
      LEFT JOIN sds
      ON activity_sds.sds_id = sds.id
      LEFT JOIN sds_substance
      ON sds.id = sds_substance.sds_id
      LEFT JOIN substance
      ON sds_substance.substance_id = substance.id
      LEFT JOIN standard
      ON standard.substance_id = substance.id
      LEFT JOIN organisation
      ON standard.organisation_id = organisation.id
      LEFT JOIN type
      ON standard.type_id = type.id
      WHERE activity.job_id = 1
      `,
      job_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
