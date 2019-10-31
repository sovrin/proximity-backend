
/**
 *
 */
const processor = (blocks) => {

	return (data) => {
		let parsed = {};
		let processed = {data};

		for (const block of blocks) {
			processed = block(processed);
			parsed = {...parsed, ...processed}
		}

		return parsed;
	}
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:41
 */
export default processor;
