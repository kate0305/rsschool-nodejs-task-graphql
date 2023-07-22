/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from "graphql";
import { UUIDType } from "./uuid.js";
import { PrismaClient } from "@prisma/client";
import { MemberType, MemberTypeIdEnum } from "./member-type.js";

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeIdEnum } },
      resolve: async ({ memberTypeId }, _, context: PrismaClient) =>
        await context.memberType.findUnique({ where: { id: memberTypeId } }),
    },
  }),
});
