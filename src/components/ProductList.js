import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Product from './Product';

class ProductList extends Component {
  componentDidMount() {
    this._subscribeToNewProducts();
    this._subscribeToNewVotes();
  }

  _updateCacheAfterVote = (store, createVote, productId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedProduct = data.feed.products.find(
      (product) => product.id === productId,
    );
    votedProduct.votes = createVote.product.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  _subscribeToNewProducts = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newProduct {
            node {
              id
              title
              price
              units
              url
              description
              createdAt
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllProducts = [
          subscriptionData.data.newProduct.node,
          ...previous.feed.products,
        ];
        const result = {
          ...previous,
          feed: {
            products: newAllProducts,
          },
        };
        return result;
      },
    });
  };

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              product {
                id
                title
                price
                units
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
    });
  };

  render() {
    // 1
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>;
    }

    // 2
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>;
    }

    // 3
    const productsToRender = this.props.feedQuery.feed.products;

    return (
      <div>
        {productsToRender.map((product, index) => (
          <Product
            key={product.id}
            updateStoreAfterVote={this._updateCacheAfterVote}
            index={index}
            product={product}
          />
        ))}
      </div>
    );
  }
}

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      products {
        id
        title
        price
        units
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: 'feedQuery' })(ProductList);
