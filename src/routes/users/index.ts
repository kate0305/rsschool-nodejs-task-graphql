import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createUserBodySchema, changeUserBodySchema, subscribeBodySchema } from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        return user;
      } else {
        throw fastify.httpErrors.notFound('User not found');
      }
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const newUser = request.body;
      return await fastify.db.users.create(newUser);
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        const posts = await fastify.db.posts.findMany({ key: 'userId', equals: id });
        if (posts) posts.map(async (post) => await fastify.db.posts.delete(post.id));

        const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: id });
        if (profile) await fastify.db.profiles.delete(profile.id);

        const usersFollowing = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id });
        
        usersFollowing.map(async (user) => {
          const index = user.subscribedToUserIds.indexOf(id);
          user.subscribedToUserIds.splice(index, 1);
          await fastify.db.users.change(user.id, { subscribedToUserIds: user.subscribedToUserIds });
        });

        return await fastify.db.users.delete(id);
      } else {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const currentUserId = request.params.id;
      const userIdToSubscribe = request.body.userId;
      const userToSubscribe = await fastify.db.users.findOne({ key: 'id', equals: userIdToSubscribe });
      if (userToSubscribe) {
        await fastify.db.users.change(userIdToSubscribe, {
          subscribedToUserIds: [...userToSubscribe.subscribedToUserIds, currentUserId],
        });
      } else {
        throw fastify.httpErrors.notFound('User not found');
      }
      return userToSubscribe;
    },
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const currentUserId = request.params.id;
      const userIdToUnsubscribe = request.body.userId;
      const userToUnsubscribe = await fastify.db.users.findOne({ key: 'id', equals: userIdToUnsubscribe });
      if (userToUnsubscribe) {
        const index = userToUnsubscribe.subscribedToUserIds.indexOf(currentUserId);
        if (index === -1) {
          throw fastify.httpErrors.badRequest('User is not following him');
        } else {
          userToUnsubscribe.subscribedToUserIds.splice(index, 1);
          await fastify.db.users.change(userIdToUnsubscribe, {
            subscribedToUserIds: userToUnsubscribe.subscribedToUserIds,
          });
          return userToUnsubscribe;
        }
      } else {
        throw fastify.httpErrors.notFound('User not found');
      }
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (user) {
        return await fastify.db.users.change(id, request.body);
      } else {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );
};

export default plugin;
