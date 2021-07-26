import Datastore from 'nedb-promises';
import schema from './cocktailSchema.js';
import _ from 'lodash';
import cocktails from './cocktails.js';
import moment from 'moment';

const db = function() {

	let _instance;

	const PARAM_MAP = {
		lookup: {
			i: 'idDrink'
		},
		search: {
			s: 'strDrink',
			f: (value) => {
				const values = value.join('|');
				return ['strDrink', {'$regex': new RegExp(`^(?:${values}).*`)}]
			}
		},
		filter: {
			a: 'strAlcoholic',
			c: 'strCategory',
			g: 'strGlass',
		}
	};

	function _db() {
		if (!_instance) {
			_instance = Datastore.create(process.env.NEDB_PATH);
		}
		return _instance;
	}

	function _createFilter(params, paramMap) {
		const filter = {};
		Object.keys(params).forEach((key) => {
			const param = paramMap[key];
			if (param) {
				const values = params[key].split(',');
				if (_.isString(param)) {
					filter[param] = {'$in': values};
				} else {
					const [field, filterObj] = param(values);
					filter[field] = filterObj;
				}
			}
		});
		filter._deleted = {$ne: true};
		return filter;
	}

	function _executeQuery(params, paramMap) {
		const filter = _createFilter(params, paramMap);
		if (_.isEmpty(filter)) {
			return [];
		}
		return _db().find(filter);
	}

	async function _findDoc(idDrink) {
		const doc = await _db().findOne({idDrink});
		if (doc == null) {
			const record = await cocktails.fetch('lookup', {i: idDrink});
			if (!record || record.drinks == null) {
				throw new Error(`No record found with idDrink: ${idDrink}`);
			}
			await create(
				record.drinks[0]
			);
			return record.drinks[0];
		}
		return doc;
	}

	function fetch(endpoint, params) {
		const paramMap = PARAM_MAP[endpoint];
		if (paramMap) {
			return _executeQuery(params, paramMap);
		}
	}

	async function create(obj) {
		const structure = {};
		Object.keys(schema.fields).map(key => {
			structure[key] = null;
		});
		const fullObj = _.merge(structure, obj);

		fullObj.dateModified = moment().format('YYYY-MM-DD HH:mm:ss');

		await schema.validate(obj);
		await _db().insert(obj);
		return fullObj;
	}

	async function update(idDrink, obj) {
		obj.dateModified = moment().format('YYYY-MM-DD HH:mm:ss');

		const doc = await _findDoc(idDrink);
		const newDoc = _.merge(doc, obj);
		await schema.validate(newDoc);
		await _db().update({idDrink}, newDoc);
		return newDoc;
	}

	async function remove(idDrink) {
		const doc = await _findDoc(idDrink);
		await _db().update({idDrink}, {$set: {_deleted: true}});
		return doc;
	}

	return {
		remove,
		update,
		create,
		fetch
	}
};

export default db();
