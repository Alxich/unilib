import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Category {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  icon!: string;

  @Field(() => String)
  link!: string;
}
