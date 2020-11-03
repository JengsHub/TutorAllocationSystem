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
exports.Availability = void 0;
const typeorm_1 = require("typeorm");
const Staff_1 = require("./Staff");
let Availability = class Availability {
};
__decorate([
    typeorm_1.ManyToOne(() => Staff_1.Staff, (staff) => staff.availability, { primary: true }),
    __metadata("design:type", Staff_1.Staff)
], Availability.prototype, "staff", void 0);
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", Number)
], Availability.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "time" }),
    __metadata("design:type", Number)
], Availability.prototype, "timeRanges", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Availability.prototype, "maxHours", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Availability.prototype, "maxNumberActivities", void 0);
Availability = __decorate([
    typeorm_1.Entity()
], Availability);
exports.Availability = Availability;
