import { logger } from '@modules/winston';

import { NotMatchedError, DuplicatedEntryError } from '@errors';

import { CreatedResultDTO, UserDTO, SurveyDTO, UserInputDTO } from '@dto/index';

const LOG_TAG: string = '[User/DAO]';

const { sequelize, User } = require('@sequelize');
const { user: MongooseUser } = require('@mongoose');

class UserDao {
    /**
     * 유저 생성
     *
     * @param {UserInputDTO} UserInputDTO
     * @return {CreatedResultDTO<UserDTO>} createdResultDTO
     * @throws {DuplicatedEntryError} if it can be make user because of ER_DUP_ENTRY
     */
    async create(
        userInputDTO: UserInputDTO
    ): Promise<CreatedResultDTO<UserDTO>> {
        logger.debug(`${LOG_TAG} create(userInputDTO = ${userInputDTO})`);
        return User.create(
            Object.assign(
                { accessTime: sequelize.literal('CURRENT_TIMESTAMP') },
                { ...userInputDTO }
            )
        )
            .then((it: UserDTO) => {
                return new CreatedResultDTO<UserDTO>(
                    it.userIdx,
                    UserDTO.createByJson(it)
                );
            })
            .catch((err: Error | any) => {
                if (
                    err.parent.errno === 1062 ||
                    err.parent.code === 'ER_DUP_ENTRY'
                ) {
                    throw new DuplicatedEntryError();
                }
                throw err;
            });
    }

    /**
     * 유저 조회
     *
     * @param {Object} whereObj
     * @returns {Promise<UserDTO>} UserDTO
     * @throws {NotMatchedError} if there is no User
     */
    async read(where: any) {
        logger.debug(`${LOG_TAG} read(where = ${JSON.stringify(where)})`);
        const result = await User.findOne({ where, nest: true, raw: true });
        if (!result) {
            throw new NotMatchedError();
        }
        return UserDTO.createByJson(result);
    }

    /**
     * 유저 조회
     *
     * @param {number} userIdx
     * @returns {Promise<UserDTO>} UserDTO
     * @throws {NotMatchedError} if there is no User
     */
    async readByIdx(userIdx: number) {
        logger.debug(`${LOG_TAG} readByIdx(userIdx = ${userIdx})`);
        const result = await User.findByPk(userIdx);
        if (!result) {
            throw new NotMatchedError();
        }
        return UserDTO.createByJson(result.dataValues);
    }

    /**
     * 유저 수정
     *
     * @param {Object} User
     * @return {Promise<number>} affectedRows
     * @throws {NotMatchedError} if there is no User
     */
    async update(userInputDTO: UserInputDTO): Promise<number> {
        logger.debug(`${LOG_TAG} update(userInputDTO = ${userInputDTO})`);
        const result = await User.update(
            { ...userInputDTO },
            {
                where: { userIdx: userInputDTO.userIdx },
            }
        );
        const affectedRows = result[0];
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }

    /**
     * 유저 access Time 갱신
     *
     * @param {number} userIdx
     * @return {Promise<number>} affectedRows
     * @throws {NotMatchedError} if there is no User
     */
    async updateAccessTime(userIdx: number) {
        logger.debug(`${LOG_TAG} updateAccessTime(userIdx = ${userIdx})`);
        const accessTime = sequelize.literal('CURRENT_TIMESTAMP');
        const result = await User.update(
            { accessTime },
            { where: { userIdx }, silent: true }
        );
        const affectedRows = result[0];
        if (affectedRows == 0) {
            throw new NotMatchedError();
        }
        return affectedRows;
    }

    /**
     * 유저 삭제
     *
     * @param {number} userIdx
     * @return {Promise}
     */
    async delete(userIdx: number) {
        logger.debug(`${LOG_TAG} delete(userIdx = ${userIdx})`);
        return User.destroy({ where: { userIdx } });
    }

    /**
     * 서베이 등록
     *
     * @param {SurveyDTO} survey
     * @return {Promise}
     */
    async postSurvey(surveyDTO: SurveyDTO) {
        logger.debug(`${LOG_TAG} postSurvey(surveyDTO = ${surveyDTO})`);
        return MongooseUser.create(surveyDTO).catch((err: any) => {
            if (err.code == 11000) {
                return MongooseUser.updateByPk(surveyDTO.userIdx, {
                    surveyKeywordList: surveyDTO.surveyKeywordList,
                    surveyPerfumeList: surveyDTO.surveyPerfumeList,
                    surveySeriesList: surveyDTO.surveySeriesList,
                });
            }
            throw err;
        });
    }
}

export default UserDao;
