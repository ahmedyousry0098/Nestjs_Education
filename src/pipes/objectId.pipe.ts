import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import mongoose from 'mongoose'

export class ObjectIdPipe implements PipeTransform {
    transform(value: string, metaData: ArgumentMetadata) {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new BadRequestException('invalid ObjectId')
        } 
        return new mongoose.Types.ObjectId(value)
    }
}