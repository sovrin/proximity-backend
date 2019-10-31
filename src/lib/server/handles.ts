import {IContext} from "./context";

/**
 *
 * @param handler
 */
export const connect = (handler: Function) => (context: IContext, next) => {
    if (!context.isConnection()) {
        return next();
    }

    return handler(context, next);
};

/**
 *
 * @param handler
 */
export const message = (handler: Function) => (context: IContext, next) => {
    if (!context.isMessage()) {
        return next();
    }

    return handler(context, next);
};

/**
 *
 * @param handler
 */
export const closing = (handler: Function) => (context: IContext, next) => {
    if (!context.isClosing()) {
        return next();
    }

    return handler(context, next);
};

/**
 *
 * @param tester
 * @param handler
 */
export const match = (tester: Function, handler: Function) => (context: IContext, next) => {
    const message = context.getMessage();

    if (!context.isMessage() && !tester(message)) {
        return next();
    }

    return handler(context, next);
};