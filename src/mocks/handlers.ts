import {http, HttpResponse} from 'msw';
import type {ApiInfo} from '../types';

const apiInfo: ApiInfo = {
  name: 'DraCor API',
  version: '1.0.0',
  status: 'ok',
  existdb: 'test',
};

export const handlers = [
  http.get('*/info', () => HttpResponse.json(apiInfo)),
  http.get('*/corpora', () => HttpResponse.json([])),
];
