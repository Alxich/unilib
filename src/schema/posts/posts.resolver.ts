import { Resolver, Query, Arg } from "type-graphql";
const _ = require("lodash");

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

  @Query(() => [Post], { nullable: true })
  postByGroup(@Arg("group", () => String) group: string): Post[] | undefined {
    const postArray = posts.filter((post) => post.group === group);

    if (postArray === undefined) {
      throw new Error("Posts not found");
    }

    return postArray;
  }

  @Query(() => [Post])
  posts(): Post[] {
    return posts;
  }
}
