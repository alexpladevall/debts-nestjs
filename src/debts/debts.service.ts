import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { CreateDebtDto } from './dto/create-debt.dto';
import { Debt } from './schemas/debt.entity';
import { UsersService } from '../users/users.service';
import { IDebtTransaction, IDebt } from './interfaces/debts.interface';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debt.name)
    private readonly debtModel: Model<Debt>,
    private readonly usersService: UsersService,
  ) {}

  async addDebt(
    fromUserId: string,
    createDebtDto: CreateDebtDto,
  ): Promise<{ message: string }> {
    const { withUserId, ...debtData } = createDebtDto;
    await this.usersService.findUserById(withUserId);

    if (fromUserId === withUserId) {
      throw new BadRequestException('User cannot have debts with himself');
    }

    await this.debtModel.create({
      ...debtData,
      fromUserId,
      toUserId: withUserId,
    });

    return { message: 'Debt successfully added.' };
  }

  async findDebts(userId: string): Promise<IDebt[]> {
    const transactions = await this.debtModel.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });
    const debts = this.getTransactionsByUserId(transactions, userId);

    return Promise.all(
      debts
        .filter((debt) => debt.balance !== 0)
        .map(async (debt) => {
          try {
            const { username } = await this.usersService.findUserById(
              debt.withUserId,
            );
            return {
              id: uuid(),
              name: username,
              balance: debt.balance,
            };
          } catch (error: unknown) {}
        }),
    );
  }

  private getTransactionsByUserId(
    transactions: Debt[],
    userId: string,
  ): IDebtTransaction[] {
    const debts: IDebtTransaction[] = [];

    transactions.forEach(({ fromUserId, toUserId, quantity }) => {
      if (userId === toUserId) {
        const debt = debts.find((debt) => debt.withUserId === fromUserId);

        if (!debt) {
          debts.push({
            withUserId: fromUserId,
            balance: -quantity,
          });
        } else {
          debt.balance -= quantity;
        }
      } else {
        const debt = debts.find((debt) => debt.withUserId === toUserId);

        if (!debt) {
          debts.push({ withUserId: toUserId, balance: quantity });
        } else {
          debt.balance += quantity;
        }
      }
    });

    return debts;
  }
}
