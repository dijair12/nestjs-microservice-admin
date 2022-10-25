import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { Player } from "./interfaces/player.interface";
import { PlayerService } from "./player.service";

const ackErrors: string[] = ['E11000']

@Controller()
export class PlayerController {
  logger = new Logger(PlayerController.name)
  constructor(private readonly playerService: PlayerService) {}

  @EventPattern('create-player')
  async createPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      this.logger.log(`player: ${JSON.stringify(player)}`)
      await this.playerService.createPlayer(player)
      await channel.ack(originalMsg)
    } catch(error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      const filterAckError = ackErrors.filter(
          ackError => error.message.includes(ackError))
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

   @MessagePattern('get-player')
   async getPlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      if (_id) {
      return await this.playerService.getPlayerById(_id);
      } else {
      return await this.playerService.getAllPlayers();  
      } 
    } finally {
      await channel.ack(originalMsg)
    }      
   }

   @EventPattern('update-player')
   async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    console.log('todos os dados', data)
    try {
      this.logger.log(`updatePlayer: ${JSON.stringify(data)}`)
      const _id: string = data.id
      const player: Player = data.player
      await this.playerService.updatePlayer(_id, player)
      await channel.ack(originalMsg)
    } catch(error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }  
}

  @EventPattern('delete-player')
  async deletePlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
        await this.playerService.deletePlayer(_id)
        await channel.ack(originalMsg)
    } catch(error) {
      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }

}