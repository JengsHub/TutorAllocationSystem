import {MigrationInterface, QueryRunner} from "typeorm";

export class roleConstraint1608102756008 implements MigrationInterface {
    name = 'roleConstraint1608102756008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" character varying NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "year" integer NOT NULL, "maxHours" integer NOT NULL, "maxNumberActivities" integer NOT NULL, "staffId" uuid NOT NULL, CONSTRAINT "PK_3a01ebf2c26d9403e3c5ebcb096" PRIMARY KEY ("id", "staffId"))`);
        await queryRunner.query(`CREATE TABLE "staff_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "preferenceScore" integer NOT NULL, "lecturerScore" integer NOT NULL, "isHeadTutorCandidate" boolean NOT NULL, "staffId" uuid NOT NULL, "unitId" uuid NOT NULL, CONSTRAINT "PK_b79ed25f0d3202039c497a96fc0" PRIMARY KEY ("id", "staffId", "unitId"))`);
        await queryRunner.query(`CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitCode" character varying(7) NOT NULL, "offeringPeriod" character varying NOT NULL, "campus" character varying(2) NOT NULL, "year" integer NOT NULL, "aqfTarget" integer NOT NULL, CONSTRAINT "UQ_8e30a148fa59a34de779da4242c" UNIQUE ("unitCode", "offeringPeriod", "year"), CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "unitId" uuid NOT NULL, "staffId" uuid NOT NULL, CONSTRAINT "UQ_d81bf514ddbd48948e5fe183e64" UNIQUE ("unitId", "staffId"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "givenNames" character varying, "lastName" character varying, "aqf" integer, "studyingAqf" integer, "email" text NOT NULL, "googleId" character varying, "appRole" character varying NOT NULL DEFAULT 'User', CONSTRAINT "UQ_902985a964245652d5e3a0f5f6a" UNIQUE ("email"), CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "allocation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityId" uuid NOT NULL, "staffId" uuid NOT NULL, CONSTRAINT "PK_6396ef344467724a515df0430f4" PRIMARY KEY ("id", "activityId", "staffId"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityCode" character varying NOT NULL, "activityGroup" character varying NOT NULL, "campus" character varying(2) NOT NULL, "location" character varying NOT NULL, "duration" integer NOT NULL, "dayOfWeek" character varying NOT NULL, "startTime" TIME NOT NULL, "unitId" uuid NOT NULL, CONSTRAINT "UQ_8bc99b9d92c6c6ff616f891d2b0" UNIQUE ("activityCode", "unitId"), CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "availability" ADD CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_80a63f5601b81b641c54a5ac7a4" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_5babb225c2d139353806fb8cc33" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_25699ae3f472b0b97917aee43cf" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_97c82bdfe059dd7e0aa35f6833c" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_ef6e791603faadd9bdcd490e0a3" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "FK_13d4fc168d0c3c4f93b46ecfa20" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_13d4fc168d0c3c4f93b46ecfa20"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "FK_ef6e791603faadd9bdcd490e0a3"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_97c82bdfe059dd7e0aa35f6833c"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_25699ae3f472b0b97917aee43cf"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_5babb225c2d139353806fb8cc33"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_80a63f5601b81b641c54a5ac7a4"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "allocation"`);
        await queryRunner.query(`DROP TABLE "staff"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "unit"`);
        await queryRunner.query(`DROP TABLE "staff_preference"`);
        await queryRunner.query(`DROP TABLE "availability"`);
    }

}
