interface defaultRule {
  ruleName: string;
  value: number;
}

export const defaultRules: Array<defaultRule> = [
  {
    ruleName: "consecutiveHours",
    value: 6,
  },
  {
    ruleName: "maxHoursPerDay",
    value: 8,
  },
  {
    ruleName: "maxHoursPerWeek",
    value: 40,
  },
  {
    ruleName: "maxActivitiesPerUnit",
    value: 3,
  },
  {
    ruleName: "maxTotalActivities",
    value: 8,
  },
];
