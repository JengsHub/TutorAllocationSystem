interface defaultRule {
  ruleName: string;
  ruleDescription: string;
  value: number;
}

export const defaultRules: Array<defaultRule> = [
  {
    ruleName: "consecutiveHours",
    ruleDescription: "Max. consecutive hours a member of staff can work",
    value: 6,
  },
  {
    ruleName: "maxHoursPerDay",
    ruleDescription: "Max. number of hours a member of staff can work in a day",
    value: 8,
  },
  {
    ruleName: "maxHoursPerWeek",
    ruleDescription:
      "Max. number of hours a member of staff can work in a week",
    value: 40,
  },
  {
    ruleName: "maxActivitiesPerUnit",
    ruleDescription:
      "Max. number of activities a member of staff can be allocated to within the same unit",
    value: 3,
  },
  {
    ruleName: "maxTotalActivities",
    ruleDescription:
      "Max. number of activities a member of staff can be allocated to across all units",
    value: 8,
  },
];
