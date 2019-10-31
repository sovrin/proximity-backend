import {Server} from "ws";
import {eid} from "../../utils";
import contextFactory, {IContext} from './context';

const Prop = {
    SERVER: 'server',
    RUNNING: 'running',
    MIDDLEWARES: 'middlewares',
    CONNECTIONS: 'connections'
};

/**
 *
 * @param config
 */
const factory = (config) => {
    const state = {
        [Prop.SERVER]: null,
        [Prop.MIDDLEWARES]: [],
        [Prop.CONNECTIONS]: {},
        [Prop.RUNNING]: false,
    };

    /**
     *
     * @param prop
     */
    const update = (prop: string): any => ([
        state[prop],
        (value: any) => {
            state[prop] = value
        }
    ]);

    /**
     *
     * @param middleware
     */
    const use = (middleware): void => {
        const [middlewares, setMiddlewares] = update(Prop.MIDDLEWARES);
        middlewares.push(middleware);

        setMiddlewares(middlewares)
    };

    /**
     *
     * @param context
     */
    const run = (context: IContext) => {
        let cursor = 0;
        const [middlewares] = update(Prop.MIDDLEWARES)
            .filter(Boolean)
        ;

        /**
         *
         */
        const next = async () => {
            const middleware = middlewares[cursor++];

            if (!context.isDone() && middleware) {
                try {
                    await middleware(context, next);
                } catch (error) {
                    console.error(error);
                    await next();
                }
            }
        };

        return next()
            .catch(console.error)
        ;
    };

    /**
     *
     */
    const listen = (): void => {
        const [, setServer] = update(Prop.SERVER);
        const instance = new Server(config);

        /**
         *
         * @param socket
         * @param request
         */
        const onConnection = (socket, request) => {
            const [connections, setConnections] = update(Prop.CONNECTIONS);
            const {context, close, reset} = contextFactory(socket, request, connections);
            const id = eid();

            connections[id] = context;
            setConnections(connections);

            run(context).catch(console.error);

            /**
             *
             * @param message
             */
            const onMessage = (message) => {
                reset(message);

                run(context).catch(console.error);
            };

            /**
             *
             */
            const onClose = () => {
                close();

                run(context).then(() => {
                    delete connections[id];
                })
            };

            socket.on('message', onMessage);
            socket.on('close', onClose);
        };

        instance.on('connection', onConnection);
        setServer(instance);
    };

    /**
     *
     */
    const close = (): void => {
        const [running, setRunning] = update(Prop.RUNNING);
        const [connections, setConnections] = update(Prop.CONNECTIONS);
        const [server] = update(Prop.SERVER);

        if (!running) {
            return;
        }

        setRunning(false);

        for (const id in connections) {
            if (!connections.hasOwnProperty(id)) {
                continue;
            }

            const connection = connections[id];
            connection.close();

            delete connections[id];
        }

        setConnections(connections);
        server.close();
    };

    return {
        listen,
        close,
        use,
    }
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.10.2019
 * Time: 21:47
 */
export default factory;
