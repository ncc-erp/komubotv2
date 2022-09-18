import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyTrip } from 'src/bot/models/companyTrip.entity';
import { CompantripCommand } from './companytrip.command';
import { CompanytripService } from './companytrip.service';

@Module({
    imports : [TypeOrmModule.forFeature([CompanyTrip])],
    exports: [CompanytripService, CompantripCommand],
    providers : [CompanytripService, CompantripCommand]
})
export class CompanyModule{}