import { v7, validate, parse as parseToBytes, stringify } from "uuid";

export class Uuid {
  private readonly _value: string;

  public constructor(value: string) {
    this._value = value;
  }

  // -------------------------
  // Factories
  // -------------------------

  static create(): Uuid {
    return new Uuid(v7());
  }

  static parse(value: string): Uuid {
    if (!validate(value)) {
      throw new TypeError(`Invalid UUID: ${value}`);
    }

    return new Uuid(value.toLowerCase());
  }

  static fromBytes(bytes: Uint8Array): Uuid {
    if (bytes.length !== 16) {
      throw new TypeError("UUID must be 16 bytes");
    }

    const value = stringify(bytes);

    if (!validate(value)) {
      throw new TypeError("Invalid UUID bytes");
    }

    return new Uuid(value);
  }

  // -------------------------
  // Instance methods
  // -------------------------

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }

  toBytes(): Uint8Array {
    return parseToBytes(this._value);
  }

  equals(other: Uuid): boolean {
    return this._value === other._value;
  }

  // -------------------------
  // Type Guard
  // -------------------------

  static isUuid(value: unknown): value is Uuid {
    return value instanceof Uuid;
  }
}
