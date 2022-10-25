import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class CategoryController {
  
  constructor(
    private readonly categoryService: CategoryService,
    ) {}

  logger = new Logger(CategoryController.name);

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext
  ){
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();  

    this.logger.log(`category: ${JSON.stringify(category)}`)

    try {
      await this.categoryService.createCategoryService(category)
      await channel.ack(originalMsg)
    }catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      ackErrors.map(async(ackError) => {
        if(error.message.includes(ackError)){
          await channel.ack(originalMsg)
        }
      })
    }
  }

  @MessagePattern('get-category')
  async getCategories(
    @Payload() _id: string,
    @Ctx() context: RmqContext
  ){
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage(); 

    try {
      return _id ? 
        await this.categoryService.findOneCategoryServiceById(_id) :
        await this.categoryService.getAllCategoriesService()
    }finally{
      await channel.ack(originalMsg)
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext){
    const channel = context.getChannelRef()
      const originalMsg = context.getMessage()
      this.logger.log(`data: ${JSON.stringify(data)}`)
      try {
        const _id: string = data.id
        const category: Category = data.category
        await this.categoryService.updateCategory(_id, category)
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
