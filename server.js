import dotenv from 'dotenv-safe';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cocktails from "./lib/cocktails.js";
import storage from "./lib/storage.js";
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';

const app = express();
const port = 8081;

app.use(cors());
app.use(bodyParser.json());


app.post('/cocktail', async (req, res, next) => {
	req.body.idDrink = uuidv4();
	try {
		const newDoc = await storage.create(req.body);
		res.json({drinks: [newDoc]});
	} catch(e) {
		next(e);
	}
});

app.put('/cocktail/:idDrink', async (req, res, next) => {
	const {idDrink} = req.params;
	try {
		const newDoc = await storage.update(idDrink, req.body);
		res.json({drinks: [newDoc]});
	} catch(e) {
		next(e);
	}
});

app.delete('/cocktail/:idDrink', async (req, res) => {
	const {idDrink} = req.params;
	try {
		await storage.remove(idDrink);
		res.json({idDrink, deleted: true});
	} catch(e) {
		next(e);
	}
});

app.get('/:endpoint', async (req, res, next) => {
	const {endpoint} = req.params;
	try {
		const [data, storedCocktails] = await Promise.all([
			cocktails.fetch(endpoint, req.query),
			storage.fetch(endpoint, req.query)
		]);
		if (storedCocktails) {
			const merged = _.merge(
				_.keyBy(data.drinks, 'idDrink'), _.keyBy(storedCocktails, 'idDrink')
			);
			data.drinks = _.values(merged);
		}
		res.json(data);
	} catch (e) {
		next(e)
	}
});

app.use((err, req, res, next) => {
	res.status(401).json({error: err.message});
});

app.use(function (req, res, next) {
	res.status(404).json({error: 'Route not found: ' + req.url});
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
});
