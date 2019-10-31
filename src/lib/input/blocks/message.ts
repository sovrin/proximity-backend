import * as utils from './utils';

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:58
 */
export default (context: any, blocks: any = []) => {
	let part;
	let {data} = context;

	[part, data] = utils.extract(0, data.indexOf(':'), data);

	let parts = part.split('PHP ');
	parts = parts.pop().split(' ');

	const type = parts.shift().toUpperCase();

	[part] = utils.extract(2, data.length, data);
	data = utils.trim(part, '"');
	const hash = utils.hash(data);

	let processed = {data};
	for (const block of blocks) {
		processed = {...processed, ...block(processed)};
	}

	return {
		...context,
		data,
		type,
		hash,
		...processed,
	}
}
