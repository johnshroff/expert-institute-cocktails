import _ from 'lodash';

function or(results) {
	const mergeFn = (val1, val2) => {
		if (_.isArray(val1) && _.isArray(val2)) {
			return _.uniqWith([...val1, ...val2], _.isEqual);
		} else if (_.isArray(val1)) {
			return val1;
		}
		return val2;
	};
	return _.mergeWith.apply(null, [...results, mergeFn]);
}

function and(results) {
	const mergeFn = (val1, val2) => {
		if (val1 != null && val2 != null) {
			return _.intersectionWith(
				val1,
				val2,
				(o1, o2) => _.isEqual(o1, o2)
			);
		} else if (val1 != null) {
			return val1;
		}
		return val2;
	}
	return _.mergeWith.apply(null, [...results, mergeFn]);
}

export default {
	and,
	or
};
