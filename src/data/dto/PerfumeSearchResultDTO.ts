import { BrandDTO } from '@dto/BrandDTO';

class PerfumeSearchResultDTO {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly brandName: string;
    readonly isLiked: boolean;
    readonly imageUrl: string;
    readonly Brand: BrandDTO;
    readonly brandIdx: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(
        perfumeIdx: number,
        name: string,
        englishName: string,
        isLiked: boolean,
        imageUrl: string,
        Brand: BrandDTO,
        brandIdx: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.englishName = englishName;
        this.brandName = Brand.name;
        this.isLiked = isLiked || false;
        this.imageUrl = imageUrl;
        this.Brand = Brand;
        this.brandIdx = brandIdx;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeSearchResultDTO {
        return new PerfumeSearchResultDTO(
            json.perfumeIdx,
            json.name,
            json.englishName,
            json.isLiked,
            json.imageUrl,
            BrandDTO.createByJson(json.Brand),
            json.brandIdx,
            json.createdAt,
            json.updatedAt
        );
    }
}

export { PerfumeSearchResultDTO };
