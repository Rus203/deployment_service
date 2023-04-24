import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class GetProjectDto extends PartialType(CreateProjectDto) {}
