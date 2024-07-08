import { createContext } from 'react';
import { Limit, LimitController } from './LimitController';


const LimitControllerContext = createContext<Limit[]>([]);
const limitController = new LimitController();

limitController.read();

export { LimitControllerContext };