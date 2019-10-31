import {randomBytes} from "crypto";

/**
 *  generate random id
 *
 * @param length
 * @param charset
 * @return {*}
 */
export const eid = (length = 32, charset = 'ABCDEF012345679') => (
    [...randomBytes(length)]
        .map((n) => charset[n % charset.length])
        .reduce((acc, v, i) => {
            if ((i + 1) % 7 === 0) {
                acc.push('-');
            }

            return acc.push(v) && acc;
        }, [])
        .join('')
);