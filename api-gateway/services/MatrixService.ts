import { Matrix } from '../models/matrix';
import { IMatrixService } from '../types/matrix';

export class MatrixService implements IMatrixService {
  async findAll(): Promise<Matrix[]> {
    return await Matrix.findAll();
  }
}