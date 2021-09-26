const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const IngredientDTO = require('../data/dto/IngredientDTO');

module.exports.readByIdx = async (ingredientIdx) => {
    return new IngredientDTO({
        ingredientIdx,
        seriesIdx: 4,
        name: '재료 이름',
        englishName: 'ingredient english name',
        description: 'ingredient description',
        imageUrl: 'https://www.naver.com',
        createdAt: '2021-07-13T11:33:49.000Z',
        updatedAt: '2021-08-07T09:20:29.000Z',
    });
};

module.exports.readByName = async (ingredientName) => {
    return IngredientDTO.create({ ingredientName });
};

module.exports.readAll = async (where) => {
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map((idx) =>
            IngredientDTO.create(
                Object.assign(
                    {
                        ingredientIdx: idx,
                        seriesIdx: idx,
                        name: `재료 ${idx}`,
                        englishName: `ingredient english name ${idx}`,
                        description: `ingredient description ${idx}`,
                        imageUrl: `https://www.naver.com/${idx}`,
                        createdAt: '2021-07-13T11:33:49.000Z',
                        updatedAt: '2021-08-07T09:20:29.000Z',
                    },
                    where
                )
            )
        ),
    });
};

module.exports.search = async (pagingIndex, pagingSize, order) => {
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map(
            (idx) =>
                new IngredientDTO({
                    ingredientIdx: idx,
                    seriesIdx: idx,
                    name: `재료 ${idx}`,
                    englishName: `ingredient english name ${idx}`,
                    description: `ingredient description ${idx}`,
                    imageUrl: `https://www.naver.com/${idx}`,
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                })
        ),
    });
};

module.exports.readBySeriesIdxList = async (seriesIdxList) => {
    return [1, 2, 3, 4, 5].map(
        (idx) =>
            new IngredientDTO({
                ingredientIdx: idx,
                seriesIdx: idx,
                name: `재료 ${idx}`,
                englishName: `ingredient english name ${idx}`,
                description: `ingredient description ${idx}`,
                imageUrl: `https://www.naver.com/${idx}`,
                createdAt: '2021-07-13T11:33:49.000Z',
                updatedAt: '2021-08-07T09:20:29.000Z',
            })
    );
};

module.exports.findIngredient = async (condition) => {
    return IngredientDTO.create(condition);
};
