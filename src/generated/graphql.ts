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
  id: Scalars['String'];
  name: Scalars['String'];
  time: Scalars['String'];
};

export type CommentsAttributes = {
  __typename?: 'CommentsAttributes';
  answers: Array<CommentsAttributes>;
  author: AuthorAttributes;
  content: Array<Scalars['String']>;
  dislike: Scalars['Float'];
  id: Scalars['String'];
  likes: Scalars['Float'];
};

export type Post = {
  __typename?: 'Post';
  comments: Array<CommentsAttributes>;
  commentsCount: Scalars['Float'];
  content: Array<Scalars['String']>;
  group: Scalars['String'];
  id: Scalars['String'];
  likesCount: Scalars['Float'];
  name: Scalars['String'];
  tags: Array<Scalars['String']>;
  time: Scalars['String'];
  title: Scalars['String'];
  viewsCount: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['String'];
};

export type PostByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type PostByIdQuery = { __typename?: 'Query', post?: { __typename?: 'Post', group: string, name: string, time: string, title: string, likesCount: number, commentsCount: number, viewsCount: number, tags: Array<string>, content: Array<string>, comments: Array<{ __typename?: 'CommentsAttributes', likes: number, dislike: number, content: Array<string>, author: { __typename?: 'AuthorAttributes', id: string, name: string, time: string }, answers: Array<{ __typename?: 'CommentsAttributes', likes: number, dislike: number, content: Array<string>, author: { __typename?: 'AuthorAttributes', id: string, name: string, time: string } }> }> } | null };

export type GetPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsQuery = { __typename?: 'Query', posts: Array<{ __typename?: 'Post', id: string, group: string, name: string, time: string, title: string, likesCount: number, commentsCount: number, viewsCount: number, tags: Array<string>, content: Array<string> }> };


export const PostByIdDocument = gql`
    query postById($id: String!) {
  post(id: $id) {
    group
    name
    time
    title
    likesCount
    commentsCount
    comments {
      author {
        id
        name
        time
      }
      likes
      dislike
      content
      answers {
        author {
          id
          name
          time
        }
        likes
        dislike
        content
      }
    }
    viewsCount
    tags
    content
  }
}
    `;
export const GetPostsDocument = gql`
    query getPosts {
  posts {
    id
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
    postById(variables: PostByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostByIdQuery>(PostByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'postById', 'query');
    },
    getPosts(variables?: GetPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsQuery>(GetPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPosts', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;