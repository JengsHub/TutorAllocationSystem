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
exports.Allocation = void 0;
const typeorm_1 = require("typeorm");
const activity_1 = require("./activity");
const staff_1 = require("./staff");
let Allocation = class Allocation {
};
__decorate([
    typeorm_1.ManyToOne(() => staff_1.Staff, (staff) => staff.allocations, { primary: true }),
    typeorm_1.JoinColumn({ name: "staff_id", referencedColumnName: "id" }),
    __metadata("design:type", staff_1.Staff)
], Allocation.prototype, "staff", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.Activity, (activity) => activity.allocations, {
        primary: true,
    }),
    typeorm_1.JoinColumn({ name: "activity_code", referencedColumnName: "activity_code" }),
    __metadata("design:type", activity_1.Activity)
], Allocation.prototype, "activity", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "char",
        length: 7,
    }),
    __metadata("design:type", String)
], Allocation.prototype, "unitCode", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        type: "varchar",
    }),
    __metadata("design:type", String)
], Allocation.prototype, "offeringPeriod", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], Allocation.prototype, "activityGroup", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 2,
    }),
    __metadata("design:type", String)
], Allocation.prototype, "campus", void 0);
__decorate([
    typeorm_1.Column({ type: "varchar" }),
    __metadata("design:type", String)
], Allocation.prototype, "location", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Allocation.prototype, "duration", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 3,
    }),
    __metadata("design:type", Number)
], Allocation.prototype, "dayOfWeek", void 0);
__decorate([
    typeorm_1.Column({ type: "time" }),
    __metadata("design:type", Date)
], Allocation.prototype, "startTime", void 0);
Allocation = __decorate([
    typeorm_1.Entity()
], Allocation);
exports.Allocation = Allocation;
