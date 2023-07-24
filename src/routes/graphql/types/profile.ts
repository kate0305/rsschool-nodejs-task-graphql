import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { MemberType, MemberTypeIdEnum } from './member-type.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeIdEnum),
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeIdEnum } },
      resolve: async (
        { memberTypeId }: { memberTypeId: string },
        _,
        context: PrismaClient,
      ) => await context.memberType.findUnique({ where: { id: memberTypeId } }),
    },
    userID: {
      type: new GraphQLNonNull(UUIDType),
    },
  }),
});
