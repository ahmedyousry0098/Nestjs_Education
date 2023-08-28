import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Query } from "mongoose";

export class FindDTO {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Transform((page) => parseInt(page.value))
    page: number

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Transform((page) => parseInt(page.value))
    limit: number

    @IsString()
    @IsOptional()
    search: string;

    @IsOptional()
    @IsString()
    gt: string;

    @IsOptional()
    @IsString()
    gte: string;

    @IsOptional()
    @IsString()
    lt: string;

    @IsOptional()
    @IsString()
    lte: string;
    
    @IsOptional()
    @IsString()
    in: string;

    @IsOptional()
    @IsString()
    nin: string;

    @IsOptional()
    @IsString()
    eq: string;

    @IsOptional()
    @IsString()
    neq: string;
}

export class ApiFeatures {

    constructor(public mongooseQuery: Query<any, any>, public queryData: FindDTO) {}

    pagination () {
        let {page, limit} = this.queryData
        if (!page || page < 1) page = 1;
        if (!limit || limit < 3) limit = 3;
        this.mongooseQuery.skip((page-1)*limit).limit(limit)
        return this
    }

    search () {
        if (this.queryData.search)
        this.mongooseQuery.find({
            $or: [
                {name: {$regex: this.queryData.search, $options: 'i'}},
                {description: {$regex: this.queryData.search, $options: 'i'}}
            ]
        })
        return this
    }

    filter () {
        const excludedKeys = ['limit', 'page', 'search', 'sort']
        const queries = {...this.queryData}
        excludedKeys.forEach(key => {
            delete queries[key]
        })
        this.mongooseQuery.find(
            JSON.parse(
                JSON.stringify(queries).replace(/\b(gt|gte|lt|lte|eq|neq|in|nin)\b/g, match => `$${match}`)
            )
        )
        return this;
    }
   
}