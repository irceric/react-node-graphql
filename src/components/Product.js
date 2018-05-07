import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

class Product extends Component {
  render() {
    const { product } = this.props;
    const { title, price, units, description, url } = product;
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <div
              className="ml1 gray f11"
              onClick={() => this._voteForProduct()}
            >
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div>
            <h2>{title}</h2>
            <div>Price: ${price}</div>
            <div>Total Units: ${units}</div>
          </div>
          <div>
            <img src={url} alt="no image" />
          </div>
          <div>{description}</div>
          <div className="f6 lh-copy gray">
            {product.votes.length} votes | by{' '}
            {product.postedBy ? product.postedBy.name : 'Unknown'}{' '}
            {timeDifferenceForDate(product.createdAt)}
          </div>
        </div>
      </div>
    );
  }

  _voteForProduct = async () => {
    const { product } = this.props;
    const { id: productId } = product;
    await this.props.voteMutation({
      variables: {
        productId,
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, productId);
      },
    });
  };
}

const VOTE_MUTATION = gql`
  mutation VoteMutation($productId: ID!) {
    vote(productId: $productId) {
      id
      product {
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
`;

export default graphql(VOTE_MUTATION, {
  name: 'voteMutation',
})(Product);
