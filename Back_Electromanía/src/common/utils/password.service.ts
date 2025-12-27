import { Injectable } from '@nestjs/common';
import Configuration from 'src/config/Configuration';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
    constructor(private config: ConfigService) {

    }
    async hashPassword(password: string): Promise<string> {
        const rounds = this.config.get<number>('bcrypt.saltRounds');
        const salt = await bcrypt.genSalt(rounds);
        return await bcrypt.hash(password, salt);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
