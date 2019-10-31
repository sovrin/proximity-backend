import * as utils from './utils';

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 12:09
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;

	if (!data.includes('Stack trace: ')) {
		return {data};
	}

	let [left, parts] = data.split('Stack trace: ');
	data = utils.trim(left, '"');

	let index = 0;
	let next = index + 1;

	const traces = [];

	do {
		[left, parts] = utils.extract(parts.indexOf('#' + index), parts.indexOf('#' + next), parts);

		if (left === "") {
			traces.push(parts.trim());

			break;
		}

		traces.push(left.trim());

		index++;
		next++;
	} while (left !== "");

	const stacktrace = [];

	for (const trace of traces) {
		for (const block of blocks) {
			stacktrace.push(block({trace}))
		}
	}

	return {
		...context,
		data,
		stacktrace,
	}
}
