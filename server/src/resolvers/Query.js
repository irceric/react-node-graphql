async function feed(parent, args, ctx, info) {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};

  const allProducts = await ctx.db.query.products({});
  const count = allProducts.length;

  const queriedProductes = await ctx.db.query.products({ first, skip, where });

  return {
    productIds: queriedProductes.map((product) => product.id),
    count,
  };
}

module.exports = {
  feed,
};
