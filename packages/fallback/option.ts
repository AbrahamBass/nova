import { HttpException } from "../exceptions/exceptions";

/**
 * Option<T>
 *
 * 🇺🇸 English
 * A utility class inspired by the Option type from :contentReference[oaicite:1]{index=1}.
 * It represents a value that may or may not exist and provides safe operations
 * for transforming, validating, and extracting the value.
 *
 * It is designed to simplify business logic pipelines by avoiding repetitive
 * null/undefined checks and enabling fluent validation.
 *
 * 🇪🇸 Español
 * Clase utilitaria inspirada en el tipo Option de Rust.
 * Representa un valor que puede o no existir y permite trabajar con él
 * de forma segura mediante transformaciones, validaciones y extracción del valor.
 *
 * Está diseñada para simplificar la lógica de negocio evitando verificaciones
 * repetitivas de null/undefined y permitiendo pipelines de validación encadenados.
 */
export class Option<T> {
  private constructor(private readonly value: T | null | undefined) {}

  /**
   * Creates an Option containing a value.
   *
   * 🇺🇸 English
   * Represents a value that definitely exists.
   *
   * 🇪🇸 Español
   * Representa un valor que definitivamente existe.
   *
   * Example:
   * const user = Option.some(foundUser)
   */
  static some<T>(value: T): Option<T> {
    return new Option(value);
  }

  /**
   * Creates an empty Option.
   *
   * 🇺🇸 English
   * Represents the absence of a value.
   *
   * 🇪🇸 Español
   * Representa la ausencia de un valor.
   *
   * Example:
   * return Option.none<User>()
   */
  static none<T>(): Option<T> {
    return new Option<T>(undefined);
  }

  /**
   * Creates an Option from a nullable value.
   *
   * 🇺🇸 English
   * Converts null or undefined into Option.none().
   *
   * 🇪🇸 Español
   * Convierte null o undefined en Option.none().
   *
   * Example:
   * Option.from(await repo.findUser(id))
   */
  static from<T>(value: T | null | undefined): Option<T> {
    return new Option(value);
  }

  /**
   * Checks if the Option contains a value.
   *
   * 🇺🇸 English
   * Returns true if the Option has a value.
   *
   * 🇪🇸 Español
   * Retorna true si el Option contiene un valor.
   */
  isSome(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  /**
   * Checks if the Option is empty.
   *
   * 🇺🇸 English
   * Returns true if the Option does not contain a value.
   *
   * 🇪🇸 Español
   * Retorna true si el Option está vacío.
   */
  isNone(): boolean {
    return !this.isSome();
  }

  /**
   * Extracts the value from the Option.
   *
   * 🇺🇸 English
   * Returns the value if present, otherwise throws an error.
   *
   * 🇪🇸 Español
   * Devuelve el valor si existe, de lo contrario lanza un error.
   *
   * When to use:
   * At the end of a validation pipeline.
   */
  unwrap(): T {
    if (this.isNone()) {
      throw new Error("Tried to unwrap None");
    }
    return this.value as T;
  }

  /**
   * Extracts the value or throws a custom HttpException.
   *
   * 🇺🇸 English
   * Similar to unwrap but allows custom error handling.
   *
   * 🇪🇸 Español
   * Similar a unwrap pero permite lanzar un error personalizado.
   */
  expect(error: HttpException): T {
    if (this.isNone()) {
      throw error;
    }
    return this.value as T;
  }

  /**
   * Throws an error if the value does not exist.
   *
   * 🇺🇸 English
   * Used to enforce existence of a value.
   *
   * 🇪🇸 Español
   * Se usa para garantizar que el valor exista.
   */
  orThrow(error: HttpException): T {
    if (this.isNone()) {
      throw error;
    }
    return this.value as T;
  }

  /**
   * Transforms the contained value.
   *
   * 🇺🇸 English
   * Applies a function if the value exists.
   *
   * 🇪🇸 Español
   * Aplica una transformación si existe valor.
   */
  map<R>(fn: (value: T) => R): Option<R> {
    if (this.isNone()) return Option.none();
    return Option.some(fn(this.value as T));
  }

  /**
   * Chains Option operations.
   *
   * 🇺🇸 English
   * Used when the transformation returns another Option.
   *
   * 🇪🇸 Español
   * Se usa cuando la función devuelve otro Option.
   */
  flatMap<R>(fn: (value: T) => Option<R>): Option<R> {
    if (this.isNone()) return Option.none();
    return fn(this.value as T);
  }

  /**
   * Executes a side effect without modifying the value.
   *
   * 🇺🇸 English
   * Useful for logging or debugging.
   *
   * 🇪🇸 Español
   * Útil para logging o debugging.
   */
  tap(fn: (value: T) => void): Option<T> {
    if (this.isSome()) {
      fn(this.value as T);
    }
    return this;
  }

  /**
   * Filters the value based on a predicate.
   *
   * 🇺🇸 English
   * Throws an error if the condition fails.
   *
   * 🇪🇸 Español
   * Lanza error si la condición no se cumple.
   */
  filter(predicate: (value: T) => boolean, error: HttpException): Option<T> {
    if (this.isNone()) return this;

    if (!predicate(this.value as T)) {
      throw error;
    }

    return this;
  }

  /**
   * Ensures a condition is true.
   *
   * 🇺🇸 English
   * Used to enforce business rules.
   *
   * 🇪🇸 Español
   * Se usa para validar reglas de negocio.
   */
  ensure(predicate: (value: T) => boolean, error: HttpException): Option<T> {
    if (this.isNone()) return this;

    if (!predicate(this.value as T)) {
      throw error;
    }

    return this;
  }

  /**
   * Async validation.
   *
   * 🇺🇸 English
   * Allows asynchronous validations.
   *
   * 🇪🇸 Español
   * Permite validaciones asincrónicas.
   */
  async ensureAsync(
    predicate: (value: T) => Promise<boolean>,
    error: HttpException,
  ): Promise<Option<T>> {
    if (this.isNone()) return this;

    const result = await predicate(this.value as T);

    if (!result) {
      throw error;
    }

    return this;
  }

  /**
   * Pattern matching.
   *
   * 🇺🇸 English
   * Executes different logic depending on whether a value exists.
   *
   * 🇪🇸 Español
   * Ejecuta lógica dependiendo si existe valor o no.
   */
  match<R>(cases: { some: (value: T) => R; none: () => R }): R {
    if (this.isSome()) {
      return cases.some(this.value as T);
    }

    return cases.none();
  }

  /**
   * Returns another Option if current one is empty.
   *
   * 🇺🇸 English
   * Provides an alternative Option.
   *
   * 🇪🇸 Español
   * Permite retornar un Option alternativo.
   */
  orElse(fn: () => Option<T>): Option<T> {
    if (this.isSome()) return this;
    return fn();
  }

  /**
   * Returns value or default.
   *
   * 🇺🇸 English
   * Safe extraction without throwing errors.
   *
   * 🇪🇸 Español
   * Devuelve el valor o un valor por defecto.
   */
  getOrElse(defaultValue: T): T {
    if (this.isNone()) return defaultValue;
    return this.value as T;
  }

  /**
   * Converts the Option into a nullable value.
   */
  toNullable(): T | null {
    return this.value ?? null;
  }

  /**
   * Converts the Option into an undefined value.
   */
  toUndefined(): T | undefined {
    return this.value ?? undefined;
  }

  /* =====================================================
     FALLBACK METHODS
     ===================================================== */

  /**
   * Returns default value if Option is empty.
   */
  orDefault(defaultValue: T): T {
    if (this.isNone()) {
      return defaultValue;
    }

    return this.value as T;
  }

  /**
   * Computes a fallback value lazily.
   */
  orElseGet(fn: () => T): T {
    if (this.isNone()) {
      return fn();
    }

    return this.value as T;
  }

  /**
   * Maps the value or returns default.
   */
  mapOr<R>(defaultValue: R, fn: (value: T) => R): R {
    if (this.isNone()) {
      return defaultValue;
    }

    return fn(this.value as T);
  }

  /**
   * Dynamic fallback version of mapOr.
   */
  mapOrElse<R>(defaultFn: () => R, fn: (value: T) => R): R {
    if (this.isNone()) {
      return defaultFn();
    }

    return fn(this.value as T);
  }

  /**
   * Returns default value if validation fails.
   */
  ensureOrDefault(
    predicate: (value: T) => boolean,
    defaultValue: T,
  ): Option<T> {
    if (this.isNone()) {
      return Option.some(defaultValue);
    }

    if (!predicate(this.value as T)) {
      return Option.some(defaultValue);
    }

    return this;
  }

  /**
   * Returns empty array if Option is empty.
   */
  orEmpty(): T {
    if (this.isNone()) {
      return [] as unknown as T;
    }

    return this.value as T;
  }

  /* =======================
     ARRAY METHODS
     ======================= */

  private asArray(): any[] {
    if (!Array.isArray(this.value)) {
      throw new Error("Option value is not an array");
    }
    return this.value;
  }

  /**
   * Ensures minimum array length.
   */
  ensureMinLength(min: number, error: HttpException): Option<T> {
    if (this.isNone()) return this;

    const arr = this.asArray();

    if (arr.length < min) {
      throw error;
    }

    return this;
  }

  /**
   * Ensures maximum array length.
   */
  ensureMaxLength(max: number, error: HttpException): Option<T> {
    if (this.isNone()) return this;

    const arr = this.asArray();

    if (arr.length > max) {
      throw error;
    }

    return this;
  }

  /**
   * Ensures exact array length.
   */
  ensureLength(length: number, error: HttpException): Option<T> {
    if (this.isNone()) return this;

    const arr = this.asArray();

    if (arr.length !== length) {
      throw error;
    }

    return this;
  }

  /**
   * Ensures every element matches condition.
   */
  ensureEvery(
    predicate: (item: any) => boolean,
    error: HttpException,
  ): Option<T> {
    if (this.isNone()) return this;

    const arr = this.asArray();

    if (!arr.every(predicate)) {
      throw error;
    }

    return this;
  }

  /**
   * Ensures at least one element matches condition.
   */
  ensureSome(
    predicate: (item: any) => boolean,
    error: HttpException,
  ): Option<T> {
    if (this.isNone()) return this;

    const arr = this.asArray();

    if (!arr.some(predicate)) {
      throw error;
    }

    return this;
  }

  /**
   * Maps elements inside an array.
   */
  mapList<R>(fn: (item: any) => R): Option<R[]> {
    if (this.isNone()) return Option.none();

    const arr = this.asArray();

    return Option.some(arr.map(fn));
  }

  /**
   * Filters elements in an array.
   */
  filterList(predicate: (item: any) => boolean): Option<any[]> {
    if (this.isNone()) return Option.none();

    const arr = this.asArray();

    return Option.some(arr.filter(predicate));
  }

  /**
   * Returns first element of array.
   */
  first(error: HttpException): Option<any> {
    if (this.isNone()) {
      throw error;
    }

    const arr = this.asArray();

    if (arr.length === 0) {
      throw error;
    }

    return Option.some(arr[0]);
  }

  /**
   * Returns last element of array.
   */
  last(error: HttpException): Option<any> {
    if (this.isNone()) {
      throw error;
    }

    const arr = this.asArray();

    if (arr.length === 0) {
      throw error;
    }

    return Option.some(arr[arr.length - 1]);
  }

  /**
   * Returns element at specific index.
   */
  at(index: number, error: HttpException): Option<any> {
    if (this.isNone()) {
      throw error;
    }

    const arr = this.asArray();

    const value = arr[index];

    if (value === undefined) {
      throw error;
    }

    return Option.some(value);
  }
}
