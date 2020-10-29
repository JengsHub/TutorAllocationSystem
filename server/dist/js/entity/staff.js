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
const allocation_1 = require("./allocation");
const staff_preference_1 = require("./staff_preference");
const availability_1 = require("./availability");
let Staff = class Staff {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", Number)
], Staff.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "text"
    }),
    __metadata("design:type", String)
], Staff.prototype, "given_names", void 0);
__decorate([
    typeorm_1.Column({
        type: "text"
    }),
    __metadata("design:type", String)
], Staff.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff.prototype, "aqf", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff.prototype, "studying_aqf", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        unique: true
    }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    typeorm_1.OneToMany(() => allocation_1.Allocation, allocation => allocation.staff),
    __metadata("design:type", Array)
], Staff.prototype, "allocations", void 0);
__decorate([
    typeorm_1.OneToMany(() => staff_preference_1.Staff_Preference, staff_preference => staff_preference.staff),
    __metadata("design:type", Array)
], Staff.prototype, "staff_preference", void 0);
__decorate([
    typeorm_1.OneToMany(() => availability_1.Availability, availability => availability.staff),
    __metadata("design:type", Array)
], Staff.prototype, "availability", void 0);
Staff = __decorate([
    typeorm_1.Entity()
], Staff);
exports.Staff = Staff;
