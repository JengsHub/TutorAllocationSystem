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
exports.Staff = void 0;
const typeorm_1 = require("typeorm");
const Allocation_1 = require("./Allocation");
const StaffPreference_1 = require("./StaffPreference");
const Availability_1 = require("./Availability");
let Staff = class Staff {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", Number)
], Staff.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
    }),
    __metadata("design:type", String)
], Staff.prototype, "givenNames", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
    }),
    __metadata("design:type", String)
], Staff.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff.prototype, "aqf", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff.prototype, "studyingAqf", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        unique: true,
    }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    typeorm_1.OneToMany(() => Allocation_1.Allocation, (allocation) => allocation.staff),
    __metadata("design:type", Array)
], Staff.prototype, "allocations", void 0);
__decorate([
    typeorm_1.OneToMany(() => StaffPreference_1.StaffPreference, (staffPreference) => staffPreference.staff),
    __metadata("design:type", Array)
], Staff.prototype, "staffPreference", void 0);
__decorate([
    typeorm_1.OneToMany(() => Availability_1.Availability, (availability) => availability.staff),
    __metadata("design:type", Array)
], Staff.prototype, "availability", void 0);
Staff = __decorate([
    typeorm_1.Entity()
], Staff);
exports.Staff = Staff;
