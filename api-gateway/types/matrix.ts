import { Matrix } from '../models/matrix';

export interface IMatrixService {
    findAll(): Promise<Matrix[]>;
}