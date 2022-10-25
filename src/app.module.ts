import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryModule } from "./category/category.module";
import { PlayerModule } from "./player/player.module";

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:8Qpn3X3pqC5GMLue@cluster0.ws1vb.mongodb.net/sradmbackend?retryWrites=true&w=majority'
    ),
    CategoryModule,
    PlayerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}