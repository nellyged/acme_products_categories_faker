const { syncAndSeed, models } = require('./db');
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 3000;
const faker = require('faker');

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '.', 'public')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

// Error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

app.get('/api/categories', (req, res, next) => {
  models.Category.findAll({
    include: [models.Product],
  })
    .then(categories => {
      const vals = [];
      Object.keys(categories).forEach(key => {
        vals.push({
          id: categories[key].get().id,
          name: categories[key].get().name,
          prods: Object.keys(categories[key].get().products).map(prodKeyMap => {
            return {
              id: categories[key].get().products[prodKeyMap].get().id,
              name: categories[key].get().products[prodKeyMap].get().name,
            };
          }),
        });
      });
      res.send(vals);
    })
    .catch(next);
});

app.post('/api/categories', async (req, res, next) => {
  const addCat = await models.Category.create({
    name: faker.commerce.department(),
  }).catch(next);

  if (addCat) {
    res.send({
      id: addCat.id,
      name: addCat.name,
      prods: [],
    });
  } else {
    res.sendStatus(500);
  }
});

app.delete('/api/categories/:id', async (req, res, next) => {
  models.Category.destroy({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

app.post('/api/categories/:id/products', async (req, res, next) => {
  const addProd = await models.Product.create({
    name: faker.commerce.productName(),
    categoryId: parseInt(req.params.id),
  }).catch(next);

  if (addProd) {
    res.send({
      id: addProd.id,
      name: addProd.name,
    });
  } else {
    res.sendStatus(500);
  }
});

app.delete('/api/products/:id', async (req, res, next) => {
  models.Category.destroy({
    where: {
      id: parseInt(req.params.id),
    },
  })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

syncAndSeed().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
