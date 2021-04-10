/**
 * This test suite contains the tests for coupons enpoints
 * on the shopping flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const addonsModel = require('../../../../api/models/addons');
const { getJWTToken } = require('../../../../api/models/auth');

describe('Addons', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });
  beforeEach(() => {
    delete require.cache[require.resolve('../../../../api/index.js')];

    sinon.stub(addonsModel, 'getAddonsByStore').returns(
      Promise.resolve({
        addons_id: 1,
        name: 'test',
        title: 'test',
        description: 'test description',
        price: 50,
        store_id: 1
      })
    );

    sinon.stub(addonsModel, 'getListOfActiveAddons').returns(
      Promise.resolve({
        addons_id: 1,
        name: 'test',
        title: 'test',
        description: 'test description',
        price: 50,
        store_id: 1
      })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('get addons by store and product', () => {
    it('should return addons associated with store and product and 200', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/shop/addons/1?product_id=1')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.addons).to.deep.equal({
            addons_id: 1,
            name: 'test',
            title: 'test',
            description: 'test description',
            price: 50,
            store_id: 1
          });

          done();
        });
    });
  });

  describe('get addons by store', () => {
    it('should return addons associated with store and 200', (done) => {
      const app = require('../../../../api/index').handler;

      request(app)
        .get('/stores/1/addons')
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.addons).to.deep.equal({
            addons_id: 1,
            name: 'test',
            title: 'test',
            description: 'test description',
            price: 50,
            store_id: 1
          });

          done();
        });
    });
  });
});
