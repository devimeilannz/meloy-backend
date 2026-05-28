import { Injectable } from '@nestjs/common';

import cloudinary from 'src/helper/cloudinary.config';

@Injectable()
export class CloudinaryService {

  async uploadFile(file: string) {

    return cloudinary.uploader.upload(file);
  }
}