import * as utils from './utils';

const MONTHS = [...Array(12)]
	.map((_, i) => new Date(1990, i, 9).toDateString().split(' '))
	.map((time) => time.slice(1))
;

const pad = (n) => ('0' + n).slice(-2);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:53
 */
export default (context: any, blocks: any = []) => {
	let {data} = context;
	let part, month, day, time;
	[part, data] = utils.extract(0, 16, data);

	[month, day, time] = part.split(' ');
	month = MONTHS.indexOf(month) + 1;
	month = pad(month);
	day = pad(day);

	const format = `2019/${month}/${day} ${time}`;
	const date = new Date(format);

	return {
		...context,
		data,
		date,
		time
	}
};
