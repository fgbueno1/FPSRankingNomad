export class InvalidLogError extends Error {
    constructor(line: string) {
      super(`Invalid log format at line: ${line}`);
      this.name = "InvalidLogError";
    }
  }