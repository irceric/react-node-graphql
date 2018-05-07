import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Product from './Product';

class Search extends Component {
	state = {
		products: [],
		filter: '',
	};

	render() {
		return (
			<div>
				<div>
					Search
					<input
						type="text"
						onChange={(e) => this.setState({ filter: e.target.value })}
					/>
					<button onClick={() => this._executeSearch()}>OK</button>
				</div>
				{this.state.products.map((product, index) => (
					<Product key={product.id} product={product} index={index} />
				))}
			</div>
		);
	}

	_executeSearch = async () => {
		const { filter } = this.state;
		const result = await this.props.client.query({
			query: FEED_SEARCH_QUERY,
			variables: { filter },
		});
		const products = result.data.feed.products;
		this.setState({ products });
	};
}

const FEED_SEARCH_QUERY = gql`
	query FeedSearchQuery($filter: String!) {
		feed(filter: $filter) {
			products {
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
`;

export default withApollo(Search);
