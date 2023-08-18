import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary'

@Injectable()
export class UploadService {
    constructor(
        private readonly _CloudinaryService: CloudinaryService
    ) {}

    async uploadImg (img: Express.Multer.File, fileName: string) {
        const uploaded_file = await this._CloudinaryService.uploadFile(
            img, 
            {
                folder: 'courses', 
                public_id: `course/${fileName}`,
            }
        )
        return uploaded_file
    }

    async deleteImg(publicId: string) {
        const deletedImg = await this._CloudinaryService.cloudinary.uploader.destroy(publicId)
        return deletedImg
    }
}
