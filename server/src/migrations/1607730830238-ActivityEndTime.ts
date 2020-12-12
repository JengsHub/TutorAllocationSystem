import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityEndTime1607730830238 implements MigrationInterface {
  name = "ActivityEndTime1607730830238";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "activity" RENAME COLUMN "duration" TO "endTime"`
    );
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "endTime"`);
    await queryRunner.query(
      `ALTER TABLE "activity" ADD "endTime" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "endTime"`);
    await queryRunner.query(
      `ALTER TABLE "activity" ADD "endTime" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "activity" RENAME COLUMN "endTime" TO "duration"`
    );
  }
}
