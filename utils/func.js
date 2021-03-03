function updateRows(result, ...jobs) {
    const perfumeList = result.rows;
    result.rows = perfumeList.map((it) => {
        return jobs.reduce((prev, cur) => {
            return cur(prev);
        }, it);
    });
    return result;
}

function removeKeyJob(...keys) {
    return (obj) => {
        const ret = Object.assign({}, obj);
        keys.forEach((it) => {
            delete ret[it];
        });
        return ret;
    };
}

function extractJob(key, ...fields) {
    return (obj) => {
        const ret = Object.assign({}, obj);
        fields.forEach((it) => {
            ret[it[1]] = obj[key][it[0]];
        });
        delete ret[key];
        return ret;
    };
}

function flatJob(...keys) {
    return (obj) => {
        let ret = Object.assign({}, obj);
        keys.forEach((key) => {
            ret = Object.assign(ret, obj[key]);
            delete ret[key];
        });
        return ret;
    };
}

module.exports = {
    updateRows,
    removeKeyJob,
    extractJob,
    flatJob,
};
