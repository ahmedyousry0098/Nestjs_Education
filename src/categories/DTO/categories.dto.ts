import { IsString, Matches, IsMongoId } from "class-validator";

export class AddCategoryDTO {
    @IsString()
    @Matches(/^(?:[a-zA-Z]{3,15}\s*){1,3}$/, {
        message: 'Category name must consists of one to three words, and only accepts letters'
    })
    name: string
}

export class UpdateCategoryDTO extends AddCategoryDTO {}