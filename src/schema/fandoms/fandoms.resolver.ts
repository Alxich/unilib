import { Resolver, Query, Arg } from "type-graphql";

import { Fandom } from "./fandom";
import fandoms from "./fandoms.json";

@Resolver(Fandom)
export class FandomsResolver {
  @Query(() => Fandom, { nullable: true })
  sidebar(@Arg("id", () => String) id: string): Fandom | undefined {
    const sidebar = fandoms.find((sidebar) => sidebar.id === id);
    if (sidebar === undefined) {
      throw new Error("Fandom not found");
    }
    return sidebar;
  }

  @Query(() => [Fandom])
  fandoms(): Fandom[] {
    return fandoms;
  }
}
