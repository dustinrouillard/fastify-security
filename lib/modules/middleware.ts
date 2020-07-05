import { Plugin } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import { verify } from 'jsonwebtoken';

import { Failed } from '@dustinrouillard/fastify-utilities/modules/response';

interface ExpressMiddlewareConfig {
  secret?: string;
  issuer?: string;
}

export function Middleware({ secret, issuer }: ExpressMiddlewareConfig = {}): Plugin<Server, IncomingMessage, ServerResponse, {}> {
  return fastifyPlugin(function Logger(server: FastifyInstance<Server, IncomingMessage, ServerResponse>, _options: RegisterOptions<{}, {}, {}>, next?: () => void) {
    server.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply<ServerResponse>, done?: () => void) => {
      if (!secret) secret = process.env.INTERNAL_SECRET || 'secret';
      if (!issuer) issuer = 'dustin.sh/api';

      try {
        let header = request.headers.authorization;
        if (!header) return Failed(reply, 403, 'missing_authentication');

        let token = header.replace(new RegExp('[bB]earer|\\s', 'g'), '');
        if (!token) return Failed(reply, 403, 'missing_authentication');

        let verifyJwt = verify(token, secret, { issuer });
        if (!verifyJwt) return Failed(reply, 403, 'invalid_authentication');

        if (done) return done();
      } catch (error) {
        console.log(error);
        return Failed(reply, 401, 'unable_to_validate', error.toString());
      }
    });

    if (next) next();
  });
}
