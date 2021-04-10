/**
 * This test suite contains the tests for addons endpoints
 * on the shopping flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const addonsModel = require('../../../api/models/addons');
const { getJWTToken } = require('../../../api/models/auth');

describe('Addons', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });

  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];
    sinon.stub(addonsModel, 'createAddons').callsFake((payload) => {
      return payload;
    });

    sinon.stub(addonsModel, 'updateAddons').callsFake((payload) => {
      return payload;
    });

    sinon.stub(addonsModel, 'fetchPartialListOfAddonsByStore').returns(Promise.resolve({
      addons_id: 1,
      name: 'test',
      title: 'test',
      description: 'test description',
      price: 50,
      store_id: 1
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('creating addons', () => {
    it('should create an new addons object and return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .post('/onboarding/stores/1/addons')
        .send({
          name: 'test',
          title: 'test',
          description: 'test description',
          price: 50,
          store_id: 1
        })
        .set('x-access-token', jwtToken)
        .expect(201)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.addon).to.deep.equal({
            name: 'test',
            title: 'test',
            description: 'test description',
            price: 50,
            store_id: 1,
            is_active: true
          });

          done();
        });
    });
  });

  describe('updating addons', () => {
    it('should update a single addons object and return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .put('/onboarding/stores/1/addons/1')
        .send({
          name: 'testing addon'
        })
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body.addon).to.deep.equal('1');

          done();
        });
    });
  });

  describe('updating addons', () => {
    it('should update a single addons object and return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/onboarding/stores/1/addons?limit=50&offset=0')
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
