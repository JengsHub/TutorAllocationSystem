import {MigrationInterface, QueryRunner} from "typeorm";

export class testmig1604721583892 implements MigrationInterface {
    name = 'testmig1604721583892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_9ab4ca98e5f13a1ad6883cdd3e1"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_d3bad881209e960126a1f0d98b5"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "timeRanges"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "PK_eeb7994b93d48a1aea24304458a"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "PK_becbf885d481d332269094342f1" PRIMARY KEY ("id", "staffId", "unitId", "unitOfferingPeriod")`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP COLUMN "unitUnitCode"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "PK_becbf885d481d332269094342f1"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "PK_b79ed25f0d3202039c497a96fc0" PRIMARY KEY ("id", "staffId", "unitId")`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP COLUMN "unitOfferingPeriod"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "offeringPeriod"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "unitUnitCode"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "unitOfferingPeriod"`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "PK_a1787b696b089bc2a62f1e3ec73"`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "PK_6396ef344467724a515df0430f4" PRIMARY KEY ("staffId", "activityId", "id")`);
        await queryRunner.query(`CREATE TYPE "availability_day_enum" AS ENUM('M', 'T', 'W', 'Th', 'F')`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "day" "availability_day_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "startTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "endTime" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unit" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "givenNames"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "givenNames" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_b9613ffa68edffc2b2ac0889f8a"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_5b8e95aed928520274186b0e23c" PRIMARY KEY ("id", "offeringPeriod")`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_5b8e95aed928520274186b0e23c"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "UQ_aa56912ec600e038fb3b70639d8" UNIQUE ("activityCode")`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "UQ_8e30a148fa59a34de779da4242c" UNIQUE ("unitCode", "offeringPeriod", "year")`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_5babb225c2d139353806fb8cc33" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_0670cc2b059fd58bdeed2fee975"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "FK_5babb225c2d139353806fb8cc33"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "UQ_8e30a148fa59a34de779da4242c"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "UQ_aa56912ec600e038fb3b70639d8"`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_4252c4be609041e559f0c80f58a"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_5b8e95aed928520274186b0e23c" PRIMARY KEY ("id", "offeringPeriod")`);
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "PK_5b8e95aed928520274186b0e23c"`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "PK_b9613ffa68edffc2b2ac0889f8a" PRIMARY KEY ("id", "unitCode", "offeringPeriod")`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "lastName" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "givenNames"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "givenNames" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "unit" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "day"`);
        await queryRunner.query(`DROP TYPE "availability_day_enum"`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP CONSTRAINT "PK_6396ef344467724a515df0430f4"`);
        await queryRunner.query(`ALTER TABLE "allocation" ADD CONSTRAINT "PK_a1787b696b089bc2a62f1e3ec73" PRIMARY KEY ("staffId", "activityId")`);
        await queryRunner.query(`ALTER TABLE "allocation" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "unitOfferingPeriod" character varying`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "unitUnitCode" character varying(7)`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "offeringPeriod" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD "unitOfferingPeriod" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "PK_b79ed25f0d3202039c497a96fc0"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "PK_becbf885d481d332269094342f1" PRIMARY KEY ("id", "staffId", "unitId", "unitOfferingPeriod")`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD "unitUnitCode" character varying(7) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff_preference" DROP CONSTRAINT "PK_becbf885d481d332269094342f1"`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "PK_eeb7994b93d48a1aea24304458a" PRIMARY KEY ("id", "staffId", "unitId", "unitUnitCode", "unitOfferingPeriod")`);
        await queryRunner.query(`ALTER TABLE "availability" ADD "timeRanges" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_d3bad881209e960126a1f0d98b5" FOREIGN KEY ("unitId", "unitUnitCode", "unitOfferingPeriod") REFERENCES "unit"("id","unitCode","offeringPeriod") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_preference" ADD CONSTRAINT "FK_9ab4ca98e5f13a1ad6883cdd3e1" FOREIGN KEY ("unitId", "unitUnitCode", "unitOfferingPeriod") REFERENCES "unit"("id","unitCode","offeringPeriod") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
