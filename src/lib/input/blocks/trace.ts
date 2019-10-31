const PATH_REGEX = /nc-core-1\.0\.0-[0-9]+(.*?\w+.php)?/;
const LINE_REGEX = /.php\((\d+)\):/;
const ON_LINE_REGEX = /.php on line (\d+)/;

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 11:08
 */
export default (context: any, blocks: any = []) => {
	let {trace} = context;

	let path, line;

	if (trace.includes('core-bundles/nc-core-1.0.0')) {
		const match = trace.match(PATH_REGEX);

		if (match) {
			path = match.pop();
		}
	}

	if (trace.includes('):')) {
		const match = trace.match(LINE_REGEX);

		if (match) {
			line = match.pop();
		}
	}

	if (trace.includes('.php on line')) {
		const match = trace.match(ON_LINE_REGEX);

		if (match) {
			line = match.pop();
		}
	}

	return {
		...context,
		line,
		path,
	}
}
