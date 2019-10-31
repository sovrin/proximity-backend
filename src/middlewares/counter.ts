import {IContext} from "../lib/server/context";
import {connect} from "../lib/server/handles";

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.10.2019
 * Time: 21:47
 */
export default connect((context: IContext) => {
    const [state, setState] = context.use('state', {});
    state.counter = 0;

    setState(state);

    return context.send('hello client');
})

