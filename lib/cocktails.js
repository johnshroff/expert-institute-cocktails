import axios from 'axios';
import combinator from './combinator.js';
import _ from 'lodash';

const api = axios.create({
	baseURL: `https://www.thecocktaildb.com/api/json/v1`
});

const cocktails = () => {

	async function _createRequest(endpoint, params) {
		const apiKey = process.env.COCKTAIL_DB_API_KEY;
		const response = await api.get(`/${apiKey}/${endpoint}.php`, {params});
		return response.data;
	}

	async function _splitParamsRequest(endpoint, key, value) {
		const values = value.split(',');
		const requests = values.map(async splitValue => {
			const params = {};
			params[key] = splitValue;
			return await _createRequest(endpoint, params);
		});
		return combinator.or(
			await Promise.all(requests)
		);
	}

	async function fetch(endpoint, params = {}) {
		if (_.isEmpty(params)) {
			return _createRequest(endpoint, params);
		}
		return combinator.and(
			await Promise.all(
				Object.keys(params).map(
					(key) => _splitParamsRequest(endpoint, key, params[key])
				)
			)
		);
	}

	return {
		fetch
	};
};

export default cocktails();
