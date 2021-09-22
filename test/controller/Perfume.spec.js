const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';

const statusCode = require('../../utils/statusCode');

const Perfume = require('../../controllers/Perfume.js');
const PerfumeThumbDTO = require('../data/dto/PerfumeThumbDTO');
const PerfumeThumbKeywordDTO = require('../data/dto/PerfumeThumbKeywordDTO');
const PerfumeDetailResponseDTO = require('../data/response_dto/perfume/PerfumeDetailResponseDTO');
const PerfumeResponseDTO = require('../data/response_dto/perfume/PerfumeResponseDTO');
const PerfumeRecommendResponseDTO = require('../data/response_dto/perfume/PerfumeRecommendResponseDTO');

const token = require('../../lib/token');
const user1token = token.create({ userIdx: 1 });

const mockPerfumeService = {};
const mockSearchHistoryService = {};
const mockPerfumeList = [
    PerfumeThumbDTO.createWithIdx(2775),
    PerfumeThumbDTO.createWithIdx(2774),
    PerfumeThumbDTO.createWithIdx(2773),
    PerfumeThumbDTO.createWithIdx(2772),
    PerfumeThumbDTO.createWithIdx(2471),
    PerfumeThumbDTO.createWithIdx(2470),
    PerfumeThumbDTO.createWithIdx(2469),
    PerfumeThumbDTO.createWithIdx(2468),
    PerfumeThumbDTO.createWithIdx(2467),
    PerfumeThumbDTO.createWithIdx(2466),
];
const mockPerfumeKeywordList = [
    PerfumeThumbKeywordDTO.createWithIdx(1, ['키워드 1', '키워드2']),
    PerfumeThumbKeywordDTO.createWithIdx(2, ['키워드']),
    PerfumeThumbKeywordDTO.createWithIdx(3, ['키워드 1', '키워드2', '키워드3']),
    PerfumeThumbKeywordDTO.createWithIdx(4, []),
    PerfumeThumbKeywordDTO.createWithIdx(6, ['키워드 1', '키워드2']),
    PerfumeThumbKeywordDTO.createWithIdx(8, ['키워드']),
];
Perfume.setPerfumeService(mockPerfumeService);
Perfume.setSearchHistoryService(mockSearchHistoryService);

describe('# Perfume Controller Test', () => {
    describe('# getPerfume Test', () => {
        it('success case', (done) => {
            mockPerfumeService.getPerfumeById = async () => {
                return {
                    perfumeIdx: 1,
                    name: '향수1',
                    brandName: '브랜드1',
                    story: '스토리1',
                    abundanceRate: '오 드 코롱',
                    volumeAndPrice: [],
                    isLiked: false,
                    Keywords: [],
                    imageUrls: [],
                    noteType: 0,
                    ingredients: {
                        top: '재료1, 재료1, 재료1, 재료1',
                        middle: '재료1',
                        base: '',
                        single: '',
                    },
                    score: 1,
                    seasonal: {
                        spring: 15,
                        summer: 0,
                        fall: 78,
                        winter: 7,
                    },
                    sillage: {
                        light: 7,
                        medium: 86,
                        heavy: 7,
                    },
                    longevity: {
                        veryWeak: 93,
                        weak: 0,
                        normal: 0,
                        strong: 7,
                        veryStrong: 0,
                    },
                    gender: {
                        male: 7,
                        neutral: 7,
                        female: 86,
                    },
                };
            };
            mockSearchHistoryService.incrementCount = async () => {};

            request(app)
                .get(`${basePath}/perfume/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('향수 조회 성공');
                    PerfumeDetailResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });
        describe('# searchPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.searchPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 204,
                    };
                };

                request(app)
                    .post(`${basePath}/perfume/search`)
                    .send({
                        searchText: 'Tom',
                        keywordList: [],
                        ingredientList: [],
                        brandList: [],
                    })
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('향수 검색 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# likePerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.likePerfume = async () => true;
                request(app)
                    .post(`${basePath}/perfume/1/like`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq(
                            '향수 좋아요' + (data ? '' : ' 취소')
                        );
                        expect(data).to.be.not.undefined;
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getLikedPerfume Test', () => {
            it('# success case', (done) => {
                mockPerfumeService.getLikedPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 204,
                    };
                };

                request(app)
                    .get(`${basePath}/user/1/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('유저가 좋아요한 향수 조회');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: 유저 id 불일치', (done) => {
                request(app)
                    .get(`${basePath}/user/2/perfume/liked`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.FORBIDDEN);
                        const { message } = res.body;
                        expect(message).to.be.eq('비정상적인 접근입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getRecentPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recentSearch = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('최근 검색한 향수 조회');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: no token', (done) => {
                request(app)
                    .get(`${basePath}/perfume/recent`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.UNAUTHORIZED);
                        const { message } = res.body;
                        expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# recommendPersonalPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeKeywordList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('향수 개인 맞춤 추천');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeRecommendResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });

            it('# Fail: no token', (done) => {
                request(app)
                    .get(`${basePath}/perfume/recommend/personal`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.UNAUTHORIZED);
                        const { message } = res.body;
                        expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# recommendCommonPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.recommendByUser = async () => {
                    return {
                        rows: mockPerfumeKeywordList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/recommend/common`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq(
                            '향수 일반 추천 (성별, 나이 반영)'
                        );
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeRecommendResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getSurveyPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.getSurveyPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/survey`)
                    .set('x-access-token', 'Bearer ' + user1token)
                    .expect((res) => {
                        expect(res.status).to.be.eq(statusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('서베이 향수 조회 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });

        describe('# getNewPerfume Test', () => {
            it('success case', (done) => {
                mockPerfumeService.getNewPerfume = async () => {
                    return {
                        rows: mockPerfumeList,
                        count: 20,
                    };
                };

                request(app)
                    .get(`${basePath}/perfume/new`)
                    .expect((res) => {
                        expect(res.status).to.be.eq(200);
                        const { message, data } = res.body;
                        expect(message).to.be.eq('새로 등록된 향수 조회 성공');
                        const { count, rows } = data;
                        expect(count).to.be.gte(0);
                        rows.forEach((it) => {
                            PerfumeResponseDTO.validTest.call(it);
                        });
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });
});
