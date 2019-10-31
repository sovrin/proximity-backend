export interface IContext {
    use(key: string, dflt?: any): [any, Function],
    send(...args: any),
    broadcast(...args: any),
    done(),
    throw(err),
    getMessage(),
    getType(),
    getHeaders(),
    getIp(),
    getMethod(),
    getPath(),
    isDone(),
    isMessage(),
    isClosing(),
    isConnection(),
}

export interface IFactory {
    context: IContext,
    close: Function,
    reset: Function,
}

const Type = {
    CLOSING: 'closing',
    CONNECTION: 'connection',
    MESSAGE: 'message',
};

const Prop = {
    CONNECTIONS: 'connections',
    TYPE: 'type',
    MESSAGE: 'message',
    DONE: 'done',
    SOCKET: 'socket',
    REQUEST: 'request',
    DATA: 'data',
};

/**
 *
 * @param ws
 * @param req
 * @param connections
 */
const factory = (ws, req, connections): IFactory => {
    const state = {
        [Prop.SOCKET]: ws,
        [Prop.REQUEST]: req,
        [Prop.CONNECTIONS]: connections,
        [Prop.TYPE]: Type.CONNECTION,
        [Prop.MESSAGE]: null,
        [Prop.DONE]: false,
        [Prop.DATA]: {},
    };

    /**
     *
     */
    const self = (): IContext => ({
        use,
        send,
        broadcast,
        done,
        throw: error,
        getMessage,
        getType,
        getHeaders,
        getIp,
        getMethod,
        getPath,
        isDone,
        isMessage,
        isClosing,
        isConnection,
    });

    /**
     *
     * @param obj
     */
    const set = (obj: object) => {
        const setter = (key: string, value: any) => {
            obj[key] = value;

            return setter;
        };

        return setter;
    };

    const use = (prop: string, deflt?: any): [any, Function] => ([
        state[Prop.DATA][prop] || deflt,
        (value: any) => {
            state[Prop.DATA][prop] = value
        }
    ]);

    /**
     *
     * @param message
     */
    const reset = (message: string): void => {
        set(state)
            (Prop.TYPE, Type.MESSAGE)
            (Prop.DONE, false)
            (Prop.MESSAGE, message)
        ;
    };

    /**
     *
     */
    const close = (): void => {
        set(state)
            (Prop.MESSAGE, null)
            (Prop.TYPE, Type.CLOSING)
        ;
    };

    /**
     *
     * @param args
     */
    const send = (...args: any): IContext => {
        state[Prop.SOCKET].send(...args);

        return self();
    };

    /**
     *
     * @param args
     */
    const broadcast = (...args: any): IContext => {
        const {connections} = state;

        for (const connection of Object.values(connections)) {
            connection[Prop.SOCKET].send(...args);
        }

        return self();
    };

    /**
     *
     */
    const done = (): IContext => {
        set(state)
            (Prop.DONE, true)
        ;

        return self();
    };

    /**
     *
     * @param err
     */
    const error = (err): void => {
        throw (err);
    };

    /**
     *
     */
    const getMessage = (): string => (
        state[Prop.MESSAGE]
    );

    /**
     *
     */
    const getType = (): string | null => (
        state[Prop.TYPE]
    );

    /**
     *
     */
    const getHeaders = (): Array<string> => (
        state[Prop.REQUEST].headers
    );

    /**
     *
     */
    const getIp = (): string => (
        state[Prop.REQUEST].connection.remoteAddress
    );

    /**
     *
     */
    const getPath = (): string => (
        state[Prop.REQUEST].url
    );

    /**
     *
     */
    const getMethod = (): string => (
        state[Prop.REQUEST].method
    );

    /**
     *
     */
    const isConnection = (): boolean => (
        getType() === Type.CONNECTION
    );

    /**
     *
     */
    const isMessage = (): boolean => (
        getType() === Type.MESSAGE
    );

    /**
     *
     */
    const isClosing = (): boolean => (
        getType() === Type.CLOSING
    );

    /**
     *
     */
    const isDone = (): boolean => (
        state[Prop.DONE] === true
    );

    return {
        context: self(),
        close,
        reset,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.10.2019
 * Time: 21:47
 */
export default factory;