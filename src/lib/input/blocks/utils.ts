const crypto = require('crypto');

/**
 *
 * @param from
 * @param to
 * @param subject
 */
export const extract = (from: number, to: number, subject: string) => ([
	subject.substr(from, (to >= 0 ? to : 0)),
	subject.substr((to >= 0 ? to : 0))
]);

/**
 *
 * @param string
 */
export const hash = (string: string) => (
	crypto
		.createHash('md5')
		.update(string)
		.digest('hex')
);

/**
 *
 * @param string
 * @param mask
 */
export const trim = (string: string, mask: string) => {
	while (~mask.indexOf(string[0])) {
		string = string.slice(1);
	}

	while (~mask.indexOf(string[string.length - 1])) {
		string = string.slice(0, -1);
	}

	return string;
};
