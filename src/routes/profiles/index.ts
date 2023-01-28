import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (profile) {
        return profile;
      } else {
        throw fastify.httpErrors.notFound('Profile not found');
      }
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId } = request.body;
      const { memberTypeId } = request.body;
      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });
      const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: userId });
      
      if (user && memberType && !profile) {
        const newProfile = request.body;
        return await fastify.db.profiles.create(newProfile);
      } else {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (profile) {
        return await fastify.db.profiles.delete(id);
      } else {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (profile) {
        return await fastify.db.profiles.change(id, request.body);
      } else {
        throw fastify.httpErrors.badRequest('Bad request');
      }
    },
  );
};

export default plugin;
