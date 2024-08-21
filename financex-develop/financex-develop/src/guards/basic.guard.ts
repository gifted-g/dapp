import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class BasicAuthMiddleware implements NestMiddleware {
  // should be fetch from the database or environment variable
  // for demonstration purposes, we are hardcoding it
  private readonly username = 'admin';
  private readonly password = 'password';
  private readonly encodedCreds = Buffer.from(
    this.username + ':' + this.password,
  ).toString('base64');

  use(req: Request, res: Response, next: NextFunction) {
    const reqCreds = req.get('authorization')?.split('Basic ')?.[1] ?? null;

    if (!reqCreds || reqCreds !== this.encodedCreds) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Access to the API"');
      res.sendStatus(401);
    } else {
      next();
    }
  }
}
