package com.example.accounts.domain;

/** Violación de una regla de negocio; el código determina el estado HTTP en la capa api. */
public class BusinessRuleException extends RuntimeException {

    public enum Code {
        INSUFFICIENT_FUNDS(409),
        DUPLICATE_TRANSFER(409),
        CORE_REJECTED(409),
        SAME_ACCOUNT(422),
        INVALID_AMOUNT(422),
        LIMIT_EXCEEDED(422),
        CURRENCY_MISMATCH(422),
        ACCOUNT_NOT_FOUND(404);

        private final int httpStatus;

        Code(int httpStatus) {
            this.httpStatus = httpStatus;
        }

        public int httpStatus() {
            return httpStatus;
        }
    }

    private final Code code;

    public BusinessRuleException(Code code, String message) {
        super(message);
        this.code = code;
    }

    public Code code() {
        return code;
    }
}
