const resolvers = {
  PostTag: {
    post: async (parent: any, args: any, { models }: any) => {
      const post = await models.Post.findById(parent.postId);
      return post;
    },
    tag: async (parent: any, args: any, { models }: any) => {
      const tag = await models.Tag.findById(parent.tagId);
      return tag;
    },
  },
  Mutation: {
    createPostTag: async (parent: any, args: any, { models }: any) => {
      const { postId, tagId } = args;

      // Check if the post and tag exist
      const post = await models.Post.findById(postId);
      if (!post) {
        throw new Error(`Post with ID ${postId} does not exist`);
      }
      const tag = await models.Tag.findById(tagId);
      if (!tag) {
        throw new Error(`Tag with ID ${tagId} does not exist`);
      }

      // Check if the post tag already exists
      const existingPostTag = await models.PostTag.findOne({
        postId,
        tagId,
      });
      if (existingPostTag) {
        throw new Error(`Post tag already exists`);
      }

      // Create the post tag
      const postTag = await models.PostTag.create({
        postId,
        tagId,
      });

      return postTag;
    },
  },
};

export default resolvers;
