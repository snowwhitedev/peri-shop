const StripeClient = require('../models/stripe');

const { updateStoreRecord, getStoreById } = require('../models/stores');
const { getUserByStoreId } = require('../models/users');
const { sendWelcomeEmailMerchant } = require('../common/mails/welcome');

exports.completeStripeConnect = async (req, res) => {
  const { code } = req.body;
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  try {
    const stripe = new StripeClient(store_id, store);
    const stripeUserId = await stripe.completeOAuth(code);
    const updatedStore = await updateStoreRecord(store_id, { stripe_user_id: stripeUserId });
    const user = await getUserByStoreId(store_id);
    await sendWelcomeEmailMerchant(user, updatedStore);
    return res.status(200).json({ user });
  } catch (err) {
    req.log.error(err);
    return res.status(500).send(`Error - ${err}`);
  }
};

exports.StripeCheckoutSession = async function (req, res) {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);
  req.log.info(`New Checkout Session storeId: ${store_id}`);
  try {
    const session = await stripe.createCheckoutSession(req.body);
    res.status(200).json(session);
  } catch (error) {
    req.log.info('error creating checkout session');
    req.log.error(error);
    res.status(500).json(error);
  }
};

exports.createStripePaymentIntent = async function (req, res) {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const paymentIntent = await stripe.createPaymentIntent(req.body.amount);
    return res.status(200).json({ paymentIntent });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.handleCreateSubscription = async function (req, res) {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const subscription = await stripe.createSubscription(req.body);
    if (subscription.type && subscription.type === 'StripeInvalidRequestError') {
      req.log.error(subscription.raw.message);
      return res.status(500).json({ error: subscription.raw.message });
    }
    return res.status(200).json({ subscription });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.handleUpdateStripeSubscription = async (req, res) => {
  const { store_id, subscription_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const subscription = await stripe.updateSubscription(subscription_id, req.body);
    if (subscription.type && subscription.type === 'StripeInvalidRequestError') {
      return res.status(500).json({ error: subscription.raw.message });
    }
    return res.status(200).json({ subscription });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleDeleteStripeSubscription = async (req, res) => {
  const { store_id, subscription_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const deleted = await stripe.deleteSubscription(subscription_id);

    if (deleted.type && deleted.type === 'StripeInvalidRequestError') {
      req.log.error(deleted.raw.message);
      return res.status(500).json({ error: deleted.raw.message });
    }
    return res.status(200).json({ deleted: true });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleFetchStripeSession = async (req, res) => {
  const { store_id, session_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const session = await stripe.fetchCheckoutSession(session_id);

    if (session.type && session.type === 'StripeInvalidRequestError') {
      req.log.error(session.raw.message);
      return res.status(500).json({ error: session.raw.message });
    }

    return res.status(200).json({ session });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleUpdateStripeSubscription = async (req, res) => {
  const { store_id, subscription_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const subscription = await stripe.updateSubscription(subscription_id, req.body);
    if (subscription.type && subscription.type === 'StripeInvalidRequestError') {
      return res.status(500).json({ error: subscription.raw.message });
    }
    return res.status(200).json({ subscription });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleDeleteStripeSubscription = async (req, res) => {
  const { store_id, subscription_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const deleted = await stripe.deleteSubscription(subscription_id);

    if (deleted.type && deleted.type === 'StripeInvalidRequestError') {
      return res.status(500).json({ error: deleted.raw.message });
    }
    return res.status(200).json({ deleted: true });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleFetchStripeSession = async (req, res) => {
  const { store_id, session_id } = req.params;
  const store = await getStoreById(store_id);
  const stripe = new StripeClient(store_id, store);

  try {
    const session = await stripe.fetchCheckoutSession(session_id);

    if (session.type && session.type === 'StripeInvalidRequestError') {
      return res.status(500).json({ error: session.raw.message });
    }

    return res.status(200).json({ session });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error });
  }
};

exports.handleCreateStripePrice = async (req, res) => {
  const { store_id } = req.params;
  const store = await getStoreById(store_id);
  const { payload } = req.body; // array of price(s)
  const stripe = new StripeClient(store_id, store);

  try {
    const promiseIterable = payload.filter(p => p !== undefined).map(p => stripe.createPrice(p.product_id, p.amount * 100, p.interval));
    await Promise.all(promiseIterable)
      .then((results) => {
        return res.status(200).json({ prices: results.map(x => x.id) });
      }).catch((err) => {
        req.log.error(err);
        return res.status(500).json({ error: `Error creating stripe price objects - ${err}` });
      });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: `Error - ${error}` });
  }
};
