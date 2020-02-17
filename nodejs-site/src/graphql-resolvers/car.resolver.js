export default {
    Query: {
      car: async (parent, { id }, { models: { Car } }, info) => {
        const post = await Car.findById({ _id: id }).exec();
        return post;
      },
      cars: async (parent, args, { models: { Car } }, info) => {
        const posts = await Car.find({ variant: args }).exec();
        return posts;
      },
    },
}