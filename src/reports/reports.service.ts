import { Injectable } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report';

@Injectable()
export class ReportsService {

    create(report: CreateReportDTO) {

    }
}
