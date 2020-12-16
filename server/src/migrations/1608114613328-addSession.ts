import { MigrationInterface, QueryRunner } from "typeorm";

export class addSession1608114613328 implements MigrationInterface {
  name = "addSession1608114613328";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" character varying NOT NULL, "expiresAt" integer NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
