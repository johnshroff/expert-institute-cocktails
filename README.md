# EI Cocktail API

Wrapper API extending https://www.thecocktaildb.com/api.php

## Features

All resources still available from https://www.thecocktaildb.com/api.php

GET http://localhost:8081/search
GET http://localhost:8081/lookup
GET http://localhost:8081/random
GET http://localhost:8081/filter
GET http://localhost:8081/list

Search, filter, or lookup by multiple comma separated values

GET http://localhost:8081/search?i=vodka,gin

Search, filter, lookup by multiple fields

GET http://localhost:8081/filter?c=Ordinary_Drink&g=Cocktail_glass

Add new cocktails:

POST http://localhost:8081/cocktails

Update existing cocktail:

PUT http://localhost:8081/cocktails/{idDrink}

Delete cocktail:

DELETE http://localhost:8081/cocktails/{idDrink}


## Installation

clone project 
```bash
git clone https://github.com/johnshroff/expert-institute-cocktails.git
```

cd into directory
```bash
cd expert-institute-cocktails
```

create .env file
```bash
cp .env.example .env
```

start server
```bash
node run server.js
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
