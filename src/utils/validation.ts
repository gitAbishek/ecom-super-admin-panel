import { isEmpty, isArray } from 'lodash';

export const checkIfEmpty = (val: unknown) => isEmpty(val);

export const checkIfArray = (val: unknown) => isArray(val);
