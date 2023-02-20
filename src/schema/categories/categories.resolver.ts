import { Resolver, Query, Arg } from "type-graphql";

import { Category } from "./category";
import categories from "./categories.json";

@Resolver(Category)
export class CategoriesResolver {
  @Query(() => Category, { nullable: true })
  sidebar(@Arg("id", () => String) id: string): Category | undefined {
    const sidebar = categories.find((sidebar) => sidebar.id === id);
    if (sidebar === undefined) {
      throw new Error("Category not found");
    }
    return sidebar;
  }

  @Query(() => [Category])
  categories(): Category[] {
    return categories;
  }
}
