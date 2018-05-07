import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_QUERY } from './ProductList';

class CreateProduct extends Component {
  state = {
    title: '',
    price: null,
    units: null,
    description: '',
    url: '',
  };

  _setField = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    const { title, price, units, description, url } = this.state;
    return (
      <div>
        <h1>Add New Product</h1>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={title}
            onChange={(e) => this._setField('title', e.target.value)}
            type="text"
            placeholder="product title"
          />
          <input
            className="mb2"
            value={price}
            onChange={(e) => this._setField('price', e.target.value)}
            type="text"
            placeholder="price"
          />
          <input
            className="mb2"
            value={units}
            onChange={(e) => this._setField('units', e.target.value)}
            type="text"
            placeholder="stock units"
          />
          <input
            className="mb2"
            value={description}
            onChange={(e) => this._setField('description', e.target.value)}
            type="text"
            placeholder="product description"
          />
          <input
            className="mb2"
            value={url}
            onChange={(e) => this._setField('url', e.target.value)}
            type="text"
            placeholder="product URL"
          />
        </div>
        <button onClick={() => this._createProduct()}>Submit</button>
      </div>
    );
  }

  _createProduct = async () => {
    const { description, url, title, price, units } = this.state;
    await this.props.postMutation({
      variables: {
        title,
        price,
        units,
        description,
        url,
      },
      update: (store, { data: { post } }) => {
        const data = store.readQuery({ query: FEED_QUERY });
        data.feed.products.splice(0, 0, post);
        store.writeQuery({
          query: FEED_QUERY,
          data,
        });
      },
    });
    this.props.history.push('/');
  };
}

const POST_MUTATION = gql`
  mutation PostMutation(
    $title: String!
    $price: Float!
    $units: Int!
    $description: String!
    $url: String!
  ) {
    post(
      title: $title
      price: $price
      units: $units
      description: $description
      url: $url
    ) {
      id
      title
      price
      units
      createdAt
      url
      description
    }
  }
`;

// 3
export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateProduct);
