import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
const diff = (left, right) => !isEqual(left, right);

export default function verifyData(data, oldData) {
  if (!!oldData && isObject(data)) {
    if (diff(data, oldData) && data !== {}) {
      return true;
    }
    return false;
  } else if (isObject(data) && !isEmpty(data)) {
    return true;
  } else if (isString(data) && data !== '') {
    return true;
  }
  return false;
}
