/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 14:24
 */
export default (context: any, blocks: any = []) => {
	let {parameters} = context;

	const abtests = {};

	for (const key in parameters) {
		if (!parameters.hasOwnProperty(key) || !key.startsWith('AB_')) {
			continue;
		}

		const name = key.slice(3);

		abtests[name] = parameters[key];
		delete parameters[key];
	}

	return {
		...context,
		abtests,
		parameters
	};
}
