const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});
const faker = require('faker');

const Category = conn.define('category', {
  name: {
    type: Sequelize.STRING,
  },
});

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
  },
});

const categoryName = (count = 3) => {
  const categories = [];
  while (categories.length < count) {
    categories.push({ name: faker.commerce.department() });
  }
  return categories;
};

const productName = (count = 3, categoryId) => {
  const products = [];
  while (products.length < count) {
    products.push({
      name: faker.commerce.productName(),
      categoryId: categoryId,
    });
  }
  return products;
};

Product.belongsTo(Category);
Category.hasMany(Product);

const syncAndSeed = () => {
  return conn.sync({ force: true }).then(() => {
    categoryName(3).forEach(async category => {
      const cat = await Promise.all([Category.create(category)]);
      productName(3, cat[0].get().id).forEach(product => {
        Product.create(product);
      });
    });
  });
};

module.exports = {
  syncAndSeed,
  models: {
    Category,
    Product,
  },
};
