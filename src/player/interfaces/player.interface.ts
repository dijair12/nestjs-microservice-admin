import Document from 'mongoose';
import { Category } from 'src/category/interfaces/category.interface';

export interface Player extends Document {
  _id?: string | any;

  readonly phoneNumber: string;
  readonly email: string;

  category: Category;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlPhotoPlayer: string;
}