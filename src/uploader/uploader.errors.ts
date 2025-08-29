export class NoFileError extends Error {
    constructor() {
      super("No file uploaded");
      this.name = "NoFileError";
    }
  }
  
  export class InvalidFormatError extends Error {
    constructor() {
      super("Invalid file format. Only .txt files are allowed.");
      this.name = "InvalidFormatError";
    }
  }
  
  export class InvalidLogError extends Error {
    constructor(line: string) {
      super(`Invalid log format at line: ${line}`);
      this.name = "InvalidLogError";
    }
  }
  