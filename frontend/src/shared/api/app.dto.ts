export interface AppConfigDataType {
  rowid?: number;
  sgroup?: string;
  skey: string;
  svalue: string;
}

export interface AppConfigResponse {
  value: AppConfigDataType[];
}