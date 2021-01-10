export const resOK = (data: any) => ({
  error: false,
  message: "",
  ...data,
});

export const resError = (message: string) => ({
  error: true,
  message,
});

export class UnauthorisedAccessedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorisedRoleError";
    this.stack = (<any> new Error()).stack;
  }
}
