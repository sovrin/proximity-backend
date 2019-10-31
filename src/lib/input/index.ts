import {
	reader as readerFactory,
	watcher as watcherFactory,
	processor as processorFactory
} from '../services';
import * as blocks from '../blocks';
const r = require('rethinkdb');

/**
 *
 * @param path
 */
const factory = (path: string, db) => {
	const reader = readerFactory(path);
	const watcher = watcherFactory(path);

	const processor = processorFactory([
		blocks.datetime,
		blocks.machine,
		(context) => blocks.message(context, [
			(context) => blocks.parameters(context),
			(context) => blocks.abtests(context),
			(context) => blocks.release(context),
			(context) => blocks.path(context),
			(context) => blocks.stacktrace(context, [
				(context) => blocks.trace(context)
			]),
		]),
	]);

	const callback = (data) => {
		const processed = processor(data);
		// const collection = db.collection('data');
		//
		// collection.insert(processed, (err, result) => {
		//
		// 	console.info(err, result);
		// })

		console.info(processed);
	};

	watcher.on('change', reader.change(callback));
	watcher.on('add', reader.add(callback));
	watcher.on('unlink', reader.unlink(callback));
	watcher.start();


	reader.prepare('2019-06-24.log');
	reader.run(callback);

	return (next) => (req, res, ..._) => {

		console.info(_);


		next(req, res, ..._);
	};
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.06.2019
 * Time: 10:12
 */
export default factory;
