import { Resolver, Query, Arg } from "type-graphql";

import { Post } from "./post";
import posts from "./posts.json";

@Resolver(Post)
export class PostsResolver {
  @Query(() => [Post])
  posts(): Post[] {
    return posts;
  }
}
