import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class AuthorAttributes {
  @Field(() => ID)
  id: string | undefined;

  @Field(() => String)
  name: string | undefined;

  @Field(() => String)
  time: string | undefined;
}

@ObjectType()
export class CommentsAttributes {
  @Field(() => ID)
  id: string | undefined;

  @Field(() => AuthorAttributes)
  author: AuthorAttributes | undefined;

  @Field(() => Number)
  likes: number | undefined;

  @Field(() => Number)
  dislike: number | undefined;

  @Field(() => [String])
  content: string[] | undefined;
}

@ObjectType()
export class Post {
  @Field(() => String)
  title: string | undefined;

  @Field(() => String)
  group: string | undefined;

  @Field(() => String)
  name: string | undefined;

  @Field(() => String)
  time: string | undefined;

  @Field(() => [String])
  tags: string[] | undefined;

  @Field(() => [String])
  content: string[] | undefined;

  @Field(() => Number)
  likesCount: number | undefined;

  @Field(() => Number)
  commentsCount: number | undefined;

  @Field(() => Number)
  viewsCount: number | undefined;

  @Field(() => [CommentsAttributes])
  comments: CommentsAttributes[] | undefined;
}
