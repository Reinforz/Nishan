import { Nishan } from '@nishans/core';
import { ApolloServer } from 'apollo-server';
import { NotionGraphqlServerResolvers } from "./Resolvers";
import { NotionGraphqlServerTypedefs } from "./typedefs";

export const server = async () => {
  const nishan = new Nishan({
    token: process.env.NISHAN_NOTION_TOKEN_V2 as string,
    interval: parseInt(process.env.NISHAN_NOTION_REQUEST_INTERVAL ?? "0") as number
  });
  
  const notion_user = await nishan.getNotionUser(process.env.NISHAN_NOTION_USER_ID as string);

  return new ApolloServer({
    typeDefs: NotionGraphqlServerTypedefs,
    resolvers: NotionGraphqlServerResolvers,
    context: () => notion_user.getProps()
  })
};