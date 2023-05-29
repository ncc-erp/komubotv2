import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2Client } from "google-auth-library";
import { KomuDashboard } from "src/bot/models/komuDashboard.entity";
import { Repository } from "typeorm";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { AuthGoogleLoginDto, SignIn } from "./dto/sign-in.dto";

@Injectable()
export class AuthService {
  private google: OAuth2Client;
  constructor(
    @InjectRepository(KomuDashboard)
    private komuDashboardRepository: Repository<KomuDashboard>,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.google = new OAuth2Client(
      configService.get("CLIENT_ID"),
      configService.get("CLIENT_SECRET")
    );
  }

  async getProfileByToken(loginDto: AuthGoogleLoginDto): Promise<any> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: loginDto.tokenId,
        audience: [this.configService.get("CLIENT_ID")],
      });

      const data = ticket.getPayload();

      return {
        email: data.email,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(email: string) {
    if (email) {
      const user = await this.komuDashboardRepository.findOne({
        where: { email: email },
      });
      if (user) {
        const payload = {
          email: user.email,
        };
        return { accessToken: this.jwtService.sign(payload) };
      } else {
        throw new NotFoundException("Login Fail - Account does not exist");
      }
    } else throw new NotFoundException("Login Fail - Account does not exist");
  }

  async register(data: CreateAuthDto): Promise<any> {
    try {
      if (
        data.password &&
        data.confirm_password &&
        data.password !== data.confirm_password
      ) {
        throw new UnauthorizedException(`Password does not match`);
      }

      const findUser = await this.komuDashboardRepository.findOne({
        where: [{ email: data.email }, { username: data.username }],
      });

      if (findUser) return { message: "Duplicate account" };
      const user = await this.komuDashboardRepository.save(
        this.komuDashboardRepository.create({
          ...data,
          createdTimestamp: Date.now(),
        })
      );
      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async login(signIn: SignIn) {
    try {
      let user: KomuDashboard;
      const username = signIn.username;
      const password = signIn.password;

      if (!username || username.length == 0) {
        throw new UnauthorizedException("Invalid user name or password");
      }

      user = await this.komuDashboardRepository.findOne({
        where: { username: username },
      });
      if ((!password && password === "") || (!username && username === "")) {
        throw new UnauthorizedException("Invalid user name or password");
      }

      if (!user)
        throw new UnauthorizedException(`Invalid user name or password`);

      if (!(await user.checkPassword(password as string))) {
        throw new UnauthorizedException("Invalid user name or password");
      }

      const payload = { email: user.username, sub: user.username };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (err) {
      throw new UnauthorizedException("Invalid user name or password");
    }
  }
}
