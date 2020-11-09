import { Connection } from "typeorm";
import {
  ConfigureOption,
  factory,
  setConnectionOptions,
  tearDownDatabase,
  useRefreshDatabase,
  useSeeding,
} from "typeorm-seeding";
import {
  Activity,
  Allocation,
  Availability,
  Staff,
  StaffPreference,
  Unit,
} from "../entity/index";

// Use to provide to other models, and use ID in fetch/delete
let staff: Staff;
let unit: Unit;
let activity: Activity;
let availability: Availability;
let staffPreference: StaffPreference;
let allocation: Allocation;

describe("Create Entity Tests", () => {
  //   jest.setTimeout(30000);

  let connection: Connection;

  beforeAll(async (done) => {
    setConnectionOptions({
      type: "sqlite",
      database: ":memory:",
      entities: ["src/entities/**/*{.ts,.js}"],
    });

    let option: ConfigureOption = {
      root: process.cwd() + "/src",
      configName: "ormconfig.ts",
      connection: "sqlite",
    };
    connection = await useRefreshDatabase(option);
    // console.log(connection);
    await useSeeding(option);
    done();
  });

  afterAll(async (done) => {
    await tearDownDatabase();
  });

  // NOTE: I removed the outer describe blocks because I'm not sure if the beforeAll runs before the blocks so check that out later

  test("Can build new Staff", async () => {
    staff = await factory(Staff)().make();
    console.log(staff);
  });

  test("Can build new Unit", async () => {
    unit = await factory(Unit)().make();
  });

  test("Can build new Acivity", async () => {
    activity = await factory(Activity)().make();
  });

  test("Can build new Availability", async () => {
    availability = await factory(Availability)().make();
  });

  test("Can build new StaffPreference", async () => {
    staffPreference = await factory(StaffPreference)().make();
  });

  test("Can build new Allocation", async () => {
    allocation = await factory(Allocation)().make();
  });
});
