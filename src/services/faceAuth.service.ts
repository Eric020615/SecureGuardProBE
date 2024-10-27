import { inject } from 'inversify'
import { provideSingleton } from '../helper/provideSingleton'
import { FaceAuthRepository } from '../repositories/faceAuth.repository'
import { FaceAuth } from '../models/faceAuth.model'
import { getCurrentTimestamp } from '../helper/time'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'

@provideSingleton(FaceAuthService)
export class FaceAuthService {
	constructor(
        @inject(FaceAuthRepository)
        private faceAuthRepository: FaceAuthRepository
    ) {}

	createFaceAuth = async (userId: string) => {
        try {
			await this.faceAuthRepository.createFaceAuthRepository(
                userId,
				new FaceAuth(
					userId,
					userId,
					getCurrentTimestamp(),
					getCurrentTimestamp(),
				),
			)
		} catch (error: any) {
			console.log(error)
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
    }
}
