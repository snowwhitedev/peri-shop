/**
 * This test a user subscribing to a product through stripe
 */

const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');

// Internals
const storeModel = require('../../../../api/models/stores');
const StripeClient = require('../../../../api/models/stripe');
const { getJWTToken } = require('../../../../api/models/auth.js');

describe('stripe subscriptions', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../../api/index.js')];
    sinon.stub(storeModel, 'getStoreById').returns(Promise.resolve({
      store_id: 1
    }));

    sinon.stub(StripeClient.prototype, 'createSubscription').callsFake((payload) => {
      return payload;
    });

    sinon.stub(StripeClient.prototype, 'updateSubscription').callsFake((payload) => {
      return payload;
    });

    sinon.stub(StripeClient.prototype, 'deleteSubscription').returns(Promise.resolve({}));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('creating subscription on stripe', () => {
    it('should create a stripe subscription object and return 200', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .post('/stripe/stores/1/subscriptions')
        .send({
          customer: 'stripe-customer-id',
          items: [
            {
              price: 'stripe-price-id'
            }
          ],
          expand: ['latest_invoice.payment_intent'],
          application_fee_percent: 1
        })
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.subscription).to.deep.equal({
            customer: 'stripe-customer-id',
            items: [
              {
                price: 'stripe-price-id'
              }
            ],
            expand: ['latest_invoice.payment_intent'],
            application_fee_percent: 1
          });

          done();
        });
    });
  });

  describe('updating subscription on stripe', () => {
    it('should update a stripe subscription object and return 200', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .post('/stripe/stores/1/subscriptions/stripe-subscription-id')
        .send({
          items: [
            {
              price: 'stripe-price-id'
            }
          ]
        })
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.subscription).to.deep.equal('stripe-subscription-id');

          done();
        });
    });
  });

  describe('deleting subscription on stripe', () => {
    it('should update a stripe subscription object and return 200', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .delete('/stripe/stores/1/subscriptions/stripe-subscription-id')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, _res) {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });
});
