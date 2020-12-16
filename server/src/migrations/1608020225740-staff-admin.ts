import { MigrationInterface, QueryRunner } from "typeorm";

export class staffAdmin1608020225740 implements MigrationInterface {
  name = "staffAdmin1608020225740";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" ADD "isAdmin" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "isAdmin"`);
  }
}
