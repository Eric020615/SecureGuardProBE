import { inject } from 'inversify'
import { provideSingleton } from '../helper/provideSingleton'
import { OperationError } from '../common/operation-error'
import { HttpStatusCode } from '../common/http-status-code'
import { UserService } from './user.service'
import { MicroEngineService } from './microEngine.service'
import { GetQrCodeByUserDto } from '../dtos/card.dto'
import { RoleEnum } from '../common/role'

@provideSingleton(CardService)
export class CardService {
	constructor(
		@inject(UserService) private userService: UserService,
		@inject(MicroEngineService) private microEngineService: MicroEngineService,
	) {}

	getQrCodeByUser = async (userGuid: string) => {
		try {
			const userData = await this.userService.getUserDetailsByIdService(userGuid)
			if (userData == null) {
				throw new OperationError('User not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			let data: GetQrCodeByUserDto
			const userCard = await this.microEngineService.getUserQrCode(
				`${userData.role} ${userData.userId.toString()}`,
				userData.badgeNumber,
			)
			if (!userCard) {
				throw new OperationError('User card not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			data = {
				badgeNumber: userCard.Result?.BadgeNo ? userCard.Result?.BadgeNo : '',
				data: userCard.Result?.Data ? userCard.Result?.Data : '',
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	getQrCodeByVisitor = async (visitorId: number, badgeNumber: string) => {
		try {
			let data: GetQrCodeByUserDto
			const userCard = await this.microEngineService.getUserQrCode(
				`${RoleEnum.VISITOR} ${visitorId.toString()}`,
				badgeNumber,
			)
			if (!userCard) {
				throw new OperationError('User card not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
			}
			data = {
				badgeNumber: userCard.Result?.BadgeNo ? userCard.Result?.BadgeNo : '',
				data: userCard.Result?.Data ? userCard.Result?.Data : '',
			}
			return data
		} catch (error: any) {
			throw new OperationError(error, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}
