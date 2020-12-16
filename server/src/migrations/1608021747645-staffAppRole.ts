import {MigrationInterface, QueryRunner} from "typeorm";

export class staffAppRole1608021747645 implements MigrationInterface {
    name = 'staffAppRole1608021747645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" RENAME COLUMN "isAdmin" TO "appRole"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "appRole"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "appRole" character varying NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "appRole"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "appRole" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "staff" RENAME COLUMN "appRole" TO "isAdmin"`);
    }

}
