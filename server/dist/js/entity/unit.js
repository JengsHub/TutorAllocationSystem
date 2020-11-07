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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const typeorm_1 = require("typeorm");
const Activity_1 = require("./Activity");
const StaffPreference_1 = require("./StaffPreference");
let Unit = class Unit {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", Number)
], Unit.prototype, "id", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar",
        length: 7,
    }),
    __metadata("design:type", String)
], Unit.prototype, "unitCode", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Unit.prototype, "offeringPeriod", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 2,
    }),
    __metadata("design:type", String)
], Unit.prototype, "campus", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Unit.prototype, "aqfTarget", void 0);
__decorate([
    typeorm_1.OneToMany(() => Activity_1.Activity, (activity) => activity.unit),
    __metadata("design:type", Array)
], Unit.prototype, "activities", void 0);
__decorate([
    typeorm_1.OneToMany(() => StaffPreference_1.StaffPreference, (staffPreference) => staffPreference.unit),
    __metadata("design:type", Array)
], Unit.prototype, "staffPreference", void 0);
Unit = __decorate([
    typeorm_1.Entity()
], Unit);
exports.Unit = Unit;
