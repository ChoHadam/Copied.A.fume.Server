import { SeriesDTO } from '@dto/SeriesDTO';

class SeriesFilterDTO extends SeriesDTO {
    readonly ingredientCategoryList: string[];
    constructor(
        seriesIdx: number,
        name: string,
        englishName: string,
        description: string,
        imageUrl: string,
        createdAt: string,
        updatedAt: string,
        ingredientCategoryList: string[]
    ) {
        super(
            seriesIdx,
            name,
            englishName,
            description,
            imageUrl,
            createdAt,
            updatedAt
        );
        this.ingredientCategoryList = ingredientCategoryList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): SeriesFilterDTO {
        const seriesIdx: number = json.seriesIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const description: string = json.description;
        const imageUrl: string = json.imageUrl;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        const ingredientCategoryList: string[] = json.ingredientCategoryList;
        return new SeriesFilterDTO(
            seriesIdx,
            name,
            englishName,
            description,
            imageUrl,
            createdAt,
            updatedAt,
            ingredientCategoryList
        );
    }
}

export { SeriesFilterDTO };
