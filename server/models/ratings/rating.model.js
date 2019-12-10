const mongoose = require('mongoose');

const { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLNonNull } = require('graphql');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema(
  {
    _userId: {
      type: ObjectId,
      index: true,
      required: 'Please supply a valid user',
    },
    _gigId: {
      type: ObjectId,
      index: true,
      required: 'Please select a service',
    },
    score: {
      type: Number,
      required: 'Please add at least one star',
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating', schema);

const fields = {
  _id: { type: GraphQLID },
  _userId: { type: GraphQLNonNull(GraphQLID) },
  _gigId: { type: GraphQLNonNull(GraphQLID) },
  score: { type: GraphQLNonNull(GraphQLInt) },
  comment: { type: GraphQLString },
};

const RatingType = new GraphQLObjectType({
  name: 'Rating',
  description: 'Rating type definition',
  fields,
});

module.exports = { fields, Rating, RatingType };
