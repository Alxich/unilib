import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthorAttributes = {
  __typename?: 'AuthorAttributes';
  id: Scalars['ID'];
  name: Scalars['String'];
  time: Scalars['String'];
};

export type CommentsAttributes = {
  __typename?: 'CommentsAttributes';
  author: AuthorAttributes;
  content: Array<Scalars['String']>;
  dislike: Scalars['Float'];
  id: Scalars['ID'];
  likes: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  comments: Array<CommentsAttributes>;
  commentsCount: Scalars['Float'];
  content: Array<Scalars['String']>;
  group: Scalars['String'];
  likesCount: Scalars['Float'];
  name: Scalars['String'];
  tags: Array<Scalars['String']>;
  time: Scalars['String'];
  title: Scalars['String'];
  viewsCount: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  posts: Array<Post>;
};

export type GetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', group: string, name: string, time: string, title: string, likesCount: number, commentsCount: number, viewsCount: number, tags: Array<string>, content: Array<string> }> };


export const GetPostsDocument = gql`
    query getPosts {
  posts {
    group
    name
    time
    title
    likesCount
    commentsCount
    viewsCount
    tags
    content
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getPosts(variables?: GetPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsQuery>(GetPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPosts', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;