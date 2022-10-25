import { Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Player } from "./interfaces/player.interface";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>
  ){}

  private readonly logger = new Logger(PlayerService.name)
      
  async createPlayer(player: Player): Promise<void> {
    try {
      const playerCreateModel = new this.playerModel(player)
      await playerCreateModel.save()
    }
    catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }
      
  async getAllPlayers(): Promise<Player[]> {
    try {
    return await this.playerModel.find().populate("category").exec()
    }
    catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }
      
  async getPlayerById(_id: string): Promise<Player> {
    try {
    return await this.playerModel.findOne({_id}).populate("category").exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }
      
  async updatePlayer(_id: string, player: Player): Promise<void> {
    console.log('data', _id)
    try {
      await this.playerModel.findOneAndUpdate({_id}, 
        {$set: player}).exec()
    }
    catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }
      
  async deletePlayer(_id): Promise<void> {
    try {
      await this.playerModel.deleteOne({_id}).exec();
    }
    catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

}