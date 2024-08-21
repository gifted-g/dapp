import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  // should be fetch from the database or environment variable
  // for demonstration purposes, we are hardcoding it
  private ACCESS_TOKEN = 'secret-access-token';

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new HttpException('Authorization header is missing', 401);
    }

    const isValid = await this.verifyAccessToken(authorization);

    if (!isValid) {
      throw new HttpException('Unauthorized', 401);
    }

    return true;
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new HttpException('Authorization should be Bearer', 401);
    }

    if (!accessToken) {
      throw new HttpException('Access token is missing', 401);
    }

    return accessToken === this.ACCESS_TOKEN;
  }
}
