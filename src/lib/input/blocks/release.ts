const RELEASE_REGEX = /nc-core-1\.0\.0-(\d+)/;

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:54
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;

	let release;
	const match = data.match(RELEASE_REGEX);

	if (match) {
		release = match.pop();
	}

	return {
		...context,
		data,
		release,
	};
}
