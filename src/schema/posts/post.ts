import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class AuthorAttributes {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  time!: string;
}

@ObjectType()
export class CommentsAttributes {
  @Field(() => String)
  id!: string;

  @Field(() => AuthorAttributes)
  author!: AuthorAttributes;

  @Field(() => Number)
  likes!: number;

  @Field(() => Number)
  dislike!: number;

  @Field(() => [CommentsAttributes])
  answers!: CommentsAttributes[];

  @Field(() => [String])
  content!: string[];
}

@ObjectType()
export class Post {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  group!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  time!: string;

  @Field(() => [String])
  tags!: string[];

  @Field(() => [String])
  content!: string[];

  @Field(() => Number)
  likesCount!: number;

  @Field(() => Number)
  commentsCount!: number;

  @Field(() => Number)
  viewsCount!: number;

  @Field(() => [CommentsAttributes])
  comments!: CommentsAttributes[];
}
