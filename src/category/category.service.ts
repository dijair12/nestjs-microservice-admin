import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ){}

  private readonly logger = new Logger(CategoryService.name)

  async createCategoryService(createCategoryDto: Category): Promise<Category>{
    try {
      const createCategory = new this.categoryModel(createCategoryDto);
      return createCategory.save()
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async getAllCategoriesService(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec()
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async findOneCategoryServiceById(_id: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async updateCategory(_id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel.findOneAndUpdate({ _id }, { $set: category }).exec();
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

}