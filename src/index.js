import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
const root = document.querySelector('#app');

class Category extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
    };
    this.createCat = this.createCat.bind(this);
    this.removeCat = this.removeCat.bind(this);
    this.createProd = this.createProd.bind(this);
    this.removeProd = this.removeProd.bind(this);
  }
  createCat() {
    axios
      .post('/api/categories')
      .then(responses => {
        return responses.data;
      })
      .then(cat => {
        //add this new category object to the state
        const categories = this.state.categories;
        categories.push(cat);
        this.setState({ categories: categories });
      });
  }
  removeCat(id) {
    axios.delete(`/api/categories/${id}`).then(() => {
      let categories = this.state.categories;
      categories = categories.filter(cat => cat.id !== id);
      this.setState({ categories: categories });
    });
  }
  createProd(catId) {
    axios
      .post(`/api/categories/${catId}/products`)
      .then(responses => {
        return responses.data;
      })
      .then(prod => {
        const categories = this.state.categories;
        categories.filter(cat => cat.id === catId)[0].prods.push(prod);
        this.setState({ categories: categories });
      });
  }
  removeProd(catId, prodId) {
    axios.delete(`/api/products/${prodId}`).then(() => {
      let categories = this.state.categories;
      categories = categories.map(cat => {
        if (cat.id === catId) {
          cat.prods = cat.prods.filter(prod => prod.id !== prodId);
        }
        return cat;
      });
      this.setState({ categories: categories });
    });
  }
  componentDidMount() {
    axios
      .get('/api/categories')
      .then(responses => {
        return responses.data;
      })
      .then(responses => {
        this.setState({ categories: responses });
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    const { createCat, removeCat, createProd, removeProd } = this;
    return (
      <div className="container">
        <h2>
          Acme Categories and Products <em>by faker</em>{' '}
        </h2>
        <button
          className="btn btn-primary"
          style={{ margin: '10px' }}
          onClick={createCat}
        >
          Create Category
        </button>
        <ul className="list-group">
          {this.state.categories.map(cat => {
            return (
              <li className="list-group-item" key={cat.id}>
                {cat.name}
                <div style={{ float: 'right' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      createProd(cat.id);
                    }}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      removeCat(cat.id);
                    }}
                  >
                    -
                  </button>
                </div>
                <br clear="all" />
                <ul className="list-group" style={{ margin: '20px' }}>
                  {cat.prods.map(prod => {
                    return (
                      <li className="list-group-item" key={prod.id}>
                        {prod.name}
                        <div style={{ float: 'right ' }}>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              removeProd(cat.id, prod.id);
                            }}
                          >
                            -
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<Category />, root);
