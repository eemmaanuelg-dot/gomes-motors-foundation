export type Id = string;
export type IsoDateTime = string;

export type Money = number;

export type Phone = string;
export type Email = string;

export type Result<T, E = DomainError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type DomainErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "INVALID_TRANSITION"
  | "CONFLICT";

export type DomainError = {
  code: DomainErrorCode;
  message: string;
};

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });

export const fail = (
  code: DomainErrorCode,
  message: string,
): Result<never> => ({ ok: false, error: { code, message } });
