// TODO: better way to manage credentials and secrets, especially when we start setting up continuous deployment
const prod = {
  PORT: 80,
  DB_HOST: "monash-tas-database.ccf41e2z44op.ap-southeast-2.rds.amazonaws.com",
  DB_PORT: "5432",
  DB_NAME: "postgres",
  DB_USERNAME: "postgres",
  DB_PASSWORD: "uCjvpUu89R897gxBUAai",
  DB_SYNC: false,
  DB_LOGS: false,
  GOOGLE_CLIENT_ID:
    "306753062234-bucmhcg6hh2t3safc9ikrovahlaahih0.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "pjPflZO-BeONRocioHqBlOgZ",
  SIB_EMAIL_KEY:
    "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",
  SMTP_SERVICE: "gmail",
  SMTP_USER: "fit3170tas@gmail.com",
  SMTP_PASSWORD: "}zT#JC3]8ke#G`*:",
  FROM_EMAIL: "fit3170tas@gmail.com",
  CLIENT_URL: "http://monash-tas.herokuapp.com",
  CLIENT_DOMAIN: "monash-tas.herokuapp.com",
};

const dev = {
  PORT: 8888,
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_NAME: "postgres",
  DB_USERNAME: "postgres",
  DB_PASSWORD: "postgres",
  DB_SYNC: true,
  DB_LOGS: true,
  GOOGLE_CLIENT_ID:
    "57204204592-d9209pd5seer582qkhplc1lo8bpnkl42.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "C5IISdZB193a2HbcOIEXbOw1",
  SIB_EMAIL_KEY:
    "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",
  SMTP_SERVICE: "gmail",
  SMTP_USER: "fit3170tas@gmail.com",
  SMTP_PASSWORD: "}zT#JC3]8ke#G`*:",
  FROM_EMAIL: "fit3170tas@gmail.com",
  CLIENT_URL: "http://localhost:3000",
  CLIENT_DOMAIN: "localhost",
};

console.log(process.env.NODE_ENV);
export const config: any = process.env.NODE_ENV === "development" ? dev : prod;
