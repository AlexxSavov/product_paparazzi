const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    candidCount: Int
    candids: [Candid]
  }
  type Auth {
    token: ID!
    user: User
  }

  scalar Upload
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
}
  type Retailer {
    _id: ID!
    name: String!
    image: String!
  }
  
  type Candid {
    _id: ID!
    image: String!
    productName: String!
    retailer: ID!
    username: String!
    createdAt: String!
  }
  
  type Query {
    me: User
    users: [User]
    user(username: String!): User
    retailers: [Retailer]
    candids(username: String!): [Candid]
  }
  type Mutation {
    fileUpload(file: Upload!, retailer: String!, product: String!): File!
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(friendId: ID!): User
    addCandid(image: String!, productName: String!, retailer: String!, username: String!): Candid
  }
`;

module.exports = typeDefs;