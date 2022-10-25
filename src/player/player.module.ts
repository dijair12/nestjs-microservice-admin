import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayersSchema } from '../player/interfaces/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
    {
      name: 'Player',
      schema: PlayersSchema
    }
  ]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
