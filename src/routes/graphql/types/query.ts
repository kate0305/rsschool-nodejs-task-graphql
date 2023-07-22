/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member-type.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, __, context: PrismaClient) =>
        await context.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
      resolve: async (_, { id }, context: PrismaClient) => {
        return await context.memberType.findUnique({ where: { id } });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, __, context: PrismaClient) => await context.post.findMany(),
    },

    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, context: PrismaClient) =>
        await context.post.findUnique({ where: { id } }),
    },

    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, context: PrismaClient) => await context.user.findMany(),
    },

    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, context: PrismaClient) => {
        return await context.user.findUnique({ where: { id } });
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, __, context: PrismaClient) => await context.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, { id }, context: PrismaClient) =>
        await context.profile.findUnique({ where: { id } }),
    },
  }),
});
