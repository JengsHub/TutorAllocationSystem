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
exports.Staff_Preference = void 0;
const typeorm_1 = require("typeorm");
const staff_1 = require("./staff");
const unit_1 = require("./unit");
let Staff_Preference = class Staff_Preference {
};
__decorate([
    typeorm_1.ManyToOne(() => staff_1.Staff, staff => staff.staff_preference, { primary: true }),
    typeorm_1.JoinColumn({ name: "staff_id", referencedColumnName: "id" }),
    __metadata("design:type", staff_1.Staff)
], Staff_Preference.prototype, "staff", void 0);
__decorate([
    typeorm_1.ManyToOne(() => unit_1.Unit, { primary: true }),
    typeorm_1.JoinColumn([
        { name: "unit_code", referencedColumnName: "unit_code" },
        { name: "offering_period", referencedColumnName: "offering_period" }
    ]),
    __metadata("design:type", unit_1.Unit)
], Staff_Preference.prototype, "unit", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff_Preference.prototype, "perference_score", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Staff_Preference.prototype, "lecturer_score", void 0);
__decorate([
    typeorm_1.Column({ type: "boolean" }),
    __metadata("design:type", Boolean)
], Staff_Preference.prototype, "is_head_tutor_candidate", void 0);
Staff_Preference = __decorate([
    typeorm_1.Entity()
], Staff_Preference);
exports.Staff_Preference = Staff_Preference;
