"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Activity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const typeorm_1 = require("typeorm");
const Unit_1 = require("./Unit");
let Activity = Activity_1 = class Activity {
};
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Activity.prototype, "activityCode", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Unit_1.Unit, (unit) => unit.activities, { primary: true }),
    typeorm_1.JoinColumn({ name: "unit_code", referencedColumnName: "unit_code" }),
    __metadata("design:type", Unit_1.Unit)
], Activity.prototype, "unit", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Activity.prototype, "offeringPeriod", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], Activity.prototype, "activityGroup", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 2,
    }),
    __metadata("design:type", String)
], Activity.prototype, "campus", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], Activity.prototype, "location", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Activity.prototype, "duration", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 3,
    }),
    __metadata("design:type", Number)
], Activity.prototype, "dayOfWeek", void 0);
__decorate([
    typeorm_1.Column({ type: "time" }),
    __metadata("design:type", Date)
], Activity.prototype, "startTime", void 0);
__decorate([
    typeorm_1.OneToMany(() => Activity_1, (activity) => activity.allocations),
    __metadata("design:type", Array)
], Activity.prototype, "allocations", void 0);
Activity = Activity_1 = __decorate([
    typeorm_1.Entity()
], Activity);
exports.Activity = Activity;
