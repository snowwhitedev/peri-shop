/**
 * This test suite contains all tests for pickups in onboarding flow
 */

const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const pickupsModel = require('../../../api/models/pickups');
const { getJWTToken } = require('../../../api/models/auth');

// TODO: fix those tests once we done.
describe('pickups', () => {
  const jwtToken = getJWTToken({
    user_id: 1,
    email: 'test@per-diem.co',
    user_type: 'merchant',
    store_id: 1
  });
  beforeEach(() => {
    delete require.cache[require.resolve('../../../api/index.js')];

    sinon.stub(pickupsModel, 'createBulkPickupTimeRecords').callsFake(function (payload) {
      return payload;
    });
    sinon.stub(pickupsModel, 'createPickup').callsFake(function (payload) {
      return payload;
    });


    sinon.stub(pickupsModel, 'getListOfPickupsByStore').callsFake(function (payload) {
      return payload;
    });


    sinon.stub(pickupsModel, 'upsertBulkPickupTimeRecords').callsFake(function (payload) {
      return payload;
    });
    sinon.stub(pickupsModel, 'softDeletePickupTimeRecord').returns(Promise.resolve(null));
    sinon.stub(pickupsModel, 'updatePickupRecord').callsFake(function (payload) {
      return payload;
    });
   
       
    sinon.stub(pickupsModel, 'getPickupById').callsFake(function (payload) {
      return payload;
    });
    sinon.stub(pickupsModel, 'deletePickupRecord').returns(Promise.resolve(null));

  });

  afterEach(() => {
    sinon.restore();
  });
  
  describe('when user is merchant and store exists', () => {
    it('should return 200 and a new pickup object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .post('/stores/1/pickups')
        .send({
            pickUpTimes: [
              {
                store_id: 1,
                start_time: '10:00',
                end_time: '16:00',
                name: 'odit',
                day: 'monday',
                title: 'natus'
              },
              {
                store_id: 1,
                start_time: '14:00',
                end_time: '16:00',
                name: 'odit',
                day: 'tuesday',
                title: 'natus'
              }
            ],
            pickup: {
              name: 'test-pickup',
              title: 'test-title',
              description: 'test-description',
              store_id: 1,
              location: {
                zip: 1234,
                state: 'test',
                city: 'test',
                country: 'test'
              },
              product_ids: []
            }
          
        })
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body).to.be.an('object');

          done();
        });
    });
  });

  describe('when user is a merchant and store exists', () => {
    it('should return 200 and a pickups object in the store', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .get('/stores/1/pickups?limit=10&offset=0')
        .set('x-access-token', jwtToken)
        .expect(200, (err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).to.be.an('object');

          done();
        });
    });
  });

  describe('when user is merchant and store exists', () => {
    it('should return 200 and a pickup object', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .put('/stores/1/pickups/1')
        .send({
            pickUpTimes: [
              {
                pickup_time_id: 1,
                store_id: 1,
                start_time: '10:00',
                end_time: '16:00',
                name: 'odit',
                day: 'monday',
                title: 'natus'
              },
              {
                pickup_time_id: null,
                store_id: 1,
                start_time: '14:00',
                end_time: '16:00',
                name: 'odit',
                day: 'tuesday',
                title: 'natus'
              }
            ],
            pickup: {
              name: 'test-pickup',
              title: 'test-title',
              description: 'test-description',
              store_id: 1,
              location: {
                zip: 1234,
                state: 'test',
                city: 'test',
                country: 'test'
              },
              product_ids: [],
              pickup_time_ids: [1]
            }
          
        })
        .set('x-access-token', jwtToken)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            throw err;
          }

          expect(res.body).to.be.an('object');

          done();
        });
    });
  });

  describe('when user is a merchant and store exists', () => {
    it('should return 200', (done) => {
      const app = require('../../../api/index').handler;

      request(app)
        .delete('/stores/1/pickups/1')
        .set('x-access-token', jwtToken)
        .expect(200, (err, _) => {
          if (err) {
            throw err;
          }

          done();
        });
    });
  });
});
