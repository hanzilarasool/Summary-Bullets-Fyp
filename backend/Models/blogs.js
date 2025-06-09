const mongoose = require("mongoose");
const slugify = require("slugify");

const categories = [
  "Business & Entrepreneurship",
  "Economics & Finance",
  "Personal Development & Success",
  "Science & Technology",
  "Society, Culture & Politics",
  "Psychology & Human Behavior",
  "Health & Well-being",
  "Relationships & Family",
  "Education & Learning",
];

const blogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    bookName: {
      type: String,
      required: true,
      unique: true,
    },
    urlSlug: {
      type: String,
      unique: true,
    },
    introduction: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    author: {
      type: String,
    },
    content: {
      type: String,
    },
    genres: [String],
    categories: {
      type: [String],
      enum: categories,
      validate: {
        validator: function (value) {
          return value.length > 0 && value.length <= 3;
        },
        message:
          "A blog must have at least one category and no more than three categories.",
      },
    },
    amazonLink: {
      type: String,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogsSchema.pre("save", function (next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.readingTime = Math.ceil(wordCount / wordsPerMinute);

  // if (!this.urlSlug || this.isModified("bookName")) {
  //   this.urlSlug = slugify(this.bookName, { lower: true, strict: true });
  // }

  next();
});

const Blogs = mongoose.model("Blogs", blogsSchema);

module.exports = Blogs;
