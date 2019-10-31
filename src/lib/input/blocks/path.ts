const PATH_REGEX = /nc-core-1\.0\.0-[0-9]+(.*?\w+.php)?/;
const LINE_DIRECT_REGEX = /.php:(\d+)/;
const LINE_REGEX = /.php\((\d+)\):/;
const ON_LINE_REGEX = /.php on line (\d+)/;

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 11:47
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;

	const match = data.match(PATH_REGEX);
	let line, path;

	if (match) {
		path = match.pop();
	}

	if (data.includes('):')) {
		const match = data.match(LINE_REGEX);

		if (match) {
			line = match.pop();
		}
	} else if (data.includes('.php:')) {
		const match = data.match(LINE_DIRECT_REGEX);

		if (match) {
			line = match.pop();
		}
	} else if (data.includes('.php on line')) {
		const match = data.match(ON_LINE_REGEX);

		if (match) {
			line = match.pop();
		}
	}

	return {
		...context,
		data,
		path,
		line,
	}
};
