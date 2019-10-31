import serverFactory from './lib/server';
import * as middlewares from './middlewares';

/**
 *
 */
const factory = () => {
    const app = serverFactory({port: 3315});

    for (const middleware of Object.values(middlewares)) {
        app.use(middleware);
    }

    return app;
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.10.2019
 * Time: 21:48
 */
export default factory;