import * as utils from './utils';

const PARAMETER_REGEX         = /[\w]+=.+?,\s?/;
const PARAMETER_REGEX_ESCAPED = /^[\w]+=".+?"/g;

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 11:04
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;

	if (!RegExp(PARAMETER_REGEX).test(data)) {
		return context;
	}

	const parameters = {};
	let left, mssg;

	do {
		left = '';

		if (data.split('=').length === 2) {
			left = data;
			data = '';
		} else {
			let delimiter = (RegExp(PARAMETER_REGEX_ESCAPED).test(data))
				? data.indexOf('",') + 2
				: data.indexOf(',') + 1
			;

			[left, data] = utils.extract(0, delimiter, data);
		}

		left = utils.trim(left, ',');
		data = data.trim();

		if (left === "") {
			continue;
		}

		const [key, value] = left.split('=');
		parameters[key] = value;

		if (key === 'mssg') {
			mssg = value.trim();
		}

	} while (left !== "");

	data = mssg;

	let processed = {parameters};
	for (const block of blocks) {
		processed = {...processed, ...block(processed)};
	}

	return {
		...context,
		data,
		parameters,
		...processed,
	}
}
