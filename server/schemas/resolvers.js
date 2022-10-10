const { AuthenticationError } = require('apollo-server-express');
const { User, Candid, Photo } = require('../models');
const { signToken } = require('../utils/auth');
const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const { finished } = require('stream/promises');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('candids');


        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('candids');

    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('candids')

    },
    retailers: async () => {
      const retailers = await Retailer.find({});
      return retailers;
    }
  },

  Mutation: {
    fileUpload: async (parent, {file, retailer, product}, context) => {
      try {
      if (context.user) {
        console.log(
          "Called File Upload",
          file,
          "user uploading the photo",
          context.user
        );
        const { createReadStream, filename, mimetype, encoding} =
          await file;

        //   await Photo.create({
        //     photoText: filename,
        //     location: "some photo location",
        //     user_id: context.user._id,
        // });

          await Candid.create({
            image: filename,
            productName: product,
            retailer: retailer,
            // productName: "Miso Soup",
            // retailer: "Walmart",
            username: context.user.username,
          }
          ), console.log(Candid);

          // Invoking the 'CreateReadStream' will return a readable Stream,
          const stream = createReadStream();

          const out = require("fs").createWriteStream(
            `./Photos/${filename}`
          );
          stream.pipe(out);
          await finished(out);

          return {filename, mimetype, encoding};

      } else {
        new AuthenticationError ("You must be logged in to upload a Candid");
      }
    } catch(error) {
      console.error("error in server during sile upload", error)
    }

    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addCandid: async (productName, image, retailerId, userId) => {
      const newCandid = await Candid.create({productName, image, retailerId, userId});
      return newCandid;
    }
  }
};

module.exports = resolvers;
