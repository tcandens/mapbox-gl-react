import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
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
