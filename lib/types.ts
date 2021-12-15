export interface JobObject {
  id: number;
  reference: string;
  pin: string;
  start_date?: Date;
  end_date?: Date;
}

export interface LogObject {
  DeviceReportedTime: string;
  FromHost: string;
  ID: number;
  Message: string;
  ReceivedAt: string;
  SysLogTag: string;
}

export interface ProcessObject {
  activity_id: number;
  activity_name: string;
  sds_id: number;
  sds_name: string;
  sds_normal_amount: number;
  sds_upper_amount: number;
  substance_id: number;
  substance_name: string;
  substance_cas: string;
  substance_lower_limit: number;
  substance_upper_limit: number;
  standard_id: number;
  standard_limit: number;
  standard_unit: string;
  standard_type_name: string;
  standard_organisation_name: string;
  standard_year: string;
}
