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
const activity_1 = require("./activity");
const staff_preference_1 = require("./staff_preference");
let Unit = class Unit {
};
__decorate([
    typeorm_1.PrimaryColumn({
        type: "char",
        length: 7
    }),
    __metadata("design:type", String)
], Unit.prototype, "unit_code", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar"
    }),
    __metadata("design:type", String)
], Unit.prototype, "offering_period", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 2
    }),
    __metadata("design:type", String)
], Unit.prototype, "campus", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Unit.prototype, "aqf_target", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_1.Activity, activity => activity.unit),
    __metadata("design:type", Array)
], Unit.prototype, "activities", void 0);
__decorate([
    typeorm_1.OneToMany(() => staff_preference_1.Staff_Preference, staff_preference => staff_preference.unit),
    __metadata("design:type", Array)
], Unit.prototype, "staff_preference", void 0);
Unit = __decorate([
    typeorm_1.Entity()
], Unit);
exports.Unit = Unit;
