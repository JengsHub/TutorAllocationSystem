import {MigrationInterface, QueryRunner} from "typeorm";

export class testmig1604740026497 implements MigrationInterface {
    name = 'testmig1604740026497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "allocation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityGroup" character varying NOT NULL, "campus" character varying(2) NOT NULL, "location" character varying NOT NULL, "duration" integer NOT NULL, "dayOfWeek" character varying(3) NOT NULL, "startTime" TIME NOT NULL, "activityId" integer NOT NULL, "staffId" uuid NOT NULL, CONSTRAINT "PK_6396ef344467724a515df0430f4" PRIMARY KEY ("id", "activityId", "staffId"))`);
        await queryRunner.query(`CREATE TYPE "availability_day_enum" AS ENUM('M', 'T', 'W', 'Th', 'F')`);
        await queryRunner.query(`CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" "availability_day_enum" NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "year" integer NOT NULL, "maxHours" integer NOT NULL, "maxNumberActivities" integer NOT NULL, "staffId" uuid NOT NULL, CONSTRAINT "PK_3a01ebf2c26d9403e3c5ebcb096" PRIMARY KEY ("id", "staffId"))`);
        await queryRunner.query(`CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "givenNames" character varying NOT NULL, "lastName" character varying NOT NULL, "aqf" integer NOT NULL, "studyingAqf" integer NOT NULL, "email" text NOT NULL, CONSTRAINT "UQ_902985a964245652d5e3a0f5f6a" UNIQUE ("email"), CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preferenceScore" integer NOT NULL, "lecturerScore" integer NOT NULL, "isHeadTutorCandidate" boolean NOT NULL, "staffId" uuid NOT NULL, "unitId" uuid NOT NULL, CONSTRAINT "PK_b79ed25f0d3202039c497a96fc0" PRIMARY KEY ("id", "staffId", "unitId"))`);
        await queryRunner.query(`CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitCode" character varying(7) NOT NULL, "offeringPeriod" character varying NOT NULL, "campus" character varying(2) NOT NULL, "year" integer NOT NULL, "aqfTarget" integer NOT NULL, CONSTRAINT "UQ_8e30a148fa59a34de779da4242c" UNIQUE ("unitCode", "offeringPeriod", "year"), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "activityCode" character varying NOT NULL, "activityGroup" character varying NOT NULL, "campus" character varying(2) NOT NULL, "location" character varying NOT NULL, "duration" integer NOT NULL, "dayOfWeek" character varying(3) NOT NULL, "startTime" TIME NOT NULL, "unitId" uuid, CONSTRAINT "UQ_aa56912ec600e038fb3b70639d8" UNIQUE ("activityCode"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_ef6e791603faadd9bdcd490e0a3" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_13d4fc168d0c3c4f93b46ecfa20" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_80a63f5601b81b641c54a5ac7a4" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_5babb225c2d139353806fb8cc33" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_5babb225c2d139353806fb8cc33"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_80a63f5601b81b641c54a5ac7a4"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_13d4fc168d0c3c4f93b46ecfa20"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_ef6e791603faadd9bdcd490e0a3"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "unit"`);
        await queryRunner.query(`DROP TABLE "staff_preference"`);
        await queryRunner.query(`DROP TABLE "staff"`);
        await queryRunner.query(`DROP TABLE "availability"`);
        await queryRunner.query(`DROP TYPE "availability_day_enum"`);
        await queryRunner.query(`DROP TABLE "allocation"`);
    }

}
