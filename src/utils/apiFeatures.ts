import { Transform } from "class-transformer";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { Query } from "mongoose";

export class FindDTO {

    @IsNumber()
    @IsPositive()
    @Transform((page) => parseInt(page.value))
    page: number

    @IsNumber()
    @IsPositive()
    @Transform((page) => parseInt(page.value))
    limit: number

    @IsString()
    search: string;

    @IsString()
    gt: string;

    @IsString()
    gte: string;

    @IsString()
    lt: string;

    @IsString()
    lte: string;
    
    @IsString()
    in: string;

    @IsString()
    nin: string;

    @IsString()
    eq: string;

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