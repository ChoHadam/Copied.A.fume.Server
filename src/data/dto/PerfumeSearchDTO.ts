class PerfumeSearchDTO {
    readonly keywordIdxList: number[];
    readonly brandIdxList: number[];
    readonly ingredientCategoryList: number[];
    readonly searchText: string;
    readonly userIdx: number;
    constructor(
        keywordIdxList: number[],
        brandIdxList: number[],
        ingredientCategoryList: number[],
        searchText: string,
        userIdx: number
    ) {
        this.userIdx = userIdx;
        this.keywordIdxList = keywordIdxList;
        this.brandIdxList = brandIdxList;
        this.ingredientCategoryList = ingredientCategoryList;
        this.searchText = searchText;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { PerfumeSearchDTO };
