import { Resolver, Query, Arg } from "type-graphql";

import { Post } from "./post";
import posts from "./posts.json";

@Resolver(Post)
export class PostsResolver {
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => String) id: string): Post | undefined {
    const post = posts.find((post) => post.id === id);
    if (post === undefined) {
      throw new Error("Post not found");
    }
    return post;
  }

  @Query(() => [Post])
  posts(): Post[] {
    return posts;
  }
}
