import {Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyTrip } from 'src/bot/models/companyTrip.entity';
import { CompanytripService } from './companytrip.service';

@Module({
    imports : [  TypeOrmModule.forFeature([CompanyTrip])],
    exports: [CompanytripService],
    providers : [CompanytripService]
})
export class CompanyModule{}