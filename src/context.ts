import {createContext} from 'react';
import {DracorContext as ContextType} from './types';

export const DracorContext = createContext<ContextType>({
  corpora: [],
});
