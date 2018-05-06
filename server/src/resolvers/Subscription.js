const newProduct = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.product(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      {},
      info,
    );
  },
};

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    return ctx.db.subscription.vote(
      // https://github.com/graphcool/prisma/issues/1734
      // { where: { mutation_in: ['CREATED'] } },
      {},
      info,
    );
  },
};

module.exports = {
  newProduct,
  newVote,
};
