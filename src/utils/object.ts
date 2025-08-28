import { get } from 'lodash';

export const getValue = (object: any, key: string, defaultValue: any = '') =>
  get(object, key, defaultValue);
