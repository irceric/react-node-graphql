function products(parent, args, context, info) {
	const { productIds } = parent;
	return context.db.query.products({ where: { id_in: productIds } }, info);
}

module.exports = {
	products,
};
