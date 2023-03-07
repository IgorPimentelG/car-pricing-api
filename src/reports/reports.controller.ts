import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';


@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDTO) {
        return this.reportsService.create(body);
    }

}
