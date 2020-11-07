import { Connection, createConnection, getConnection } from "typeorm";
import ORMConfig from "../ormconfig";

export const DBConnect = async () => {
  let connection: Connection | undefined;
  try {
    connection = getConnection();
  } catch (e) {}

  try {
    if (connection) {
      if (!connection.isConnected) {
        await connection.connect();
      }
    } else {
      let connection = await createConnection(ORMConfig);
      // TODO: should synchronize in dev only as this will drop the data
      await connection.synchronize(true);
    }
    console.log("🌴 Database connection was successful!");
  } catch (e) {
    console.error("ERROR: Database connection failed!!", e);
    throw e;
  }
};

export const TryDBConnect = async (onError: Function, next?: Function) => {
  try {
    await DBConnect();
    if (next) {
      next();
    }
  } catch (e) {
    onError();
  }
};
