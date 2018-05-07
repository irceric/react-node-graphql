const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

function post(parent, { title, price, units, url, description }, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.db.mutation.createProduct(
    {
      data: {
        title,
        price,
        units,
        url,
        description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  );
}
async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, ctx, info) {
  const user = await ctx.db.query.user({ where: { email: args.email } });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  };
}

async function vote(parent, args, ctx, info) {
  const { productId } = args;
  const userId = getUserId(ctx);
  const productExists = await ctx.db.exists.Vote({
    user: { id: userId },
    product: { id: productId },
  });
  if (productExists) {
    throw new Error(`Already voted for product: ${productId}`);
  }

  return ctx.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    },
    info,
  );
}

module.exports = {
  post,
  signup,
  login,
  vote,
};
