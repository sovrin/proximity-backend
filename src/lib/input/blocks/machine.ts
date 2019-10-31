import * as utils from './utils';

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:54
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;
	let machine;

	[machine, data] = utils.extract(0, data.indexOf('PHP '), data);

	machine = utils.trim(machine, ': ');

	return {
		...context,
		data,
		machine,
	};
}
