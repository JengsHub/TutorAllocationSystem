import {MigrationInterface, QueryRunner} from "typeorm";

export class init1610274224847 implements MigrationInterface {
    name = 'init1610274224847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "allocation" DROP COLUMN "isAccepted"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP COLUMN "isApproved"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "allocation" ADD "isApproved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD "isAccepted" boolean NOT NULL DEFAULT false`);
    }

}
