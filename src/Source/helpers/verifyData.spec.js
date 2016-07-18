/* eslint-env mocha */
/*
  eslint func-names: "off",
  prefer-arrow-callback: "off",
  dot-notation: "off",
*/
import expect from 'expect';
import verifyData from './verifyData';
import point from 'turf-point';

const locations = {
  'seattle': [-122.3372, 47.6111],
  'ballard': [-122.3847, 47.6683],
  'new york': [-73.9744, 40.7712],
};

describe('#verifyData utility', function () {
  it('should return false if data is empty object', function () {
    const data = {};
    const actual = verifyData(data);
    expect(actual).toBe(false);
  });
  it('should return false if data is null', function () {
    const data = null;
    const actual = verifyData(data);
    expect(actual).toBe(false);
  });
  it('should return false if data is empty string', function () {
    const data = '';
    const actual = verifyData(data);
    expect(actual).toBe(false);
  });
  it('should return false if data is NaN', function () {
    const data = new Number(NaN); // eslint-disable-line
    const actual = verifyData(data);
    expect(actual).toBe(false);
  });
  it('should return false if data is equal to oldData', function () {
    const data = point(locations['seattle']);
    const oldData = data;
    const actual = verifyData(data, oldData);
    expect(actual).toBe(false);
  });
  it('should return true if data is valid object', function () {
    const data = point(locations['seattle']);
    const actual = verifyData(data);
    expect(actual).toBe(true);
  });
  it('should return true if data is valid string', function () {
    const data = 'http://test.data.json';
    const actual = verifyData(data);
    expect(actual).toBe(true);
  });
  it('should return true if data is not equal to oldData', function () {
    const data = point(locations['seattle']);
    const oldData = point(locations['ballard']);
    const actual = verifyData(data, oldData);
    expect(actual).toBe(true);
  });
});
