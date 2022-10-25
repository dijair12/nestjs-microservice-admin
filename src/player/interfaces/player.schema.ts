import mongoose from 'mongoose';

export const PlayersSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  phoneNumber: {type: String},
  name: String,
  ranking: String,
  rankingPosition: Number,
  urlPhotoPlayer: String,
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
},{
  timestamps: true,
  collection: 'players'
})