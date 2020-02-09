import { prisma } from "../../../../generated/prisma-client";
import { USER_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    me: async (_, __, { request, isAuthenticated }) => {
      console.log("user parent", _);
      isAuthenticated(request);
      const { user } = request;
      const userProfile = prisma.user({ id: user.id });
      //fragments 사용  deep relation 방지
      //return prisma.user({ id: user.id }).$fragment(USER_FRAGMENT);
      const posts = await prisma.user({ id: user.id }).posts();
      return {
        user: userProfile,
        posts
      };
    }
  }
};
