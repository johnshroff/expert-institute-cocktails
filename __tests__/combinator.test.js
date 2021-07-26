import 'jest-extended';
import combinator from '../lib/combinator.js';
import _ from 'lodash';

describe('combinator test', () => {
	const results = [
		{
			"drinks": [
				{
					"id": 1,
					"name": "drink1"
				},
				{
					"id": 2,
					"name": "drink2"
				}
			]
		}, {
			"drinks": [
				{
					"id": 2,
					"name": "drink2"
				},
				{
					"id": 3,
					"name": "drink3"
				},
			],
			"ingredients": [
				{
					"id": 1,
					"name": "ingredient1"
				}
			]
		}
	];

	test('or', () => {
		const testData = _.cloneDeep(results);
		const combined = combinator.or(testData);
		expect(combined.drinks).toIncludeSameMembers([
			{
				"id": 1,
				"name": "drink1"
			},
			{
				"id": 2,
				"name": "drink2"
			},
			{
				"id": 3,
				"name": "drink3"
			}
		]);
		expect(combined.ingredients).toIncludeSameMembers([
			{
				"id": 1,
				"name": "ingredient1"
			}
		]);
	});
	test('and', () => {
		const testData = _.cloneDeep(results);
		const combined = combinator.and(testData);
		expect(combined.drinks).toIncludeSameMembers([
			{
				"id": 2,
				"name": "drink2"
			}
		]);
		expect(combined.ingredients).toIncludeSameMembers([
			{
				"id": 1,
				"name": "ingredient1"
			}
		]);
	});
});
