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

  