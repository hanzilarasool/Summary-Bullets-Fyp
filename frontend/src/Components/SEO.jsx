/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet";
import logo1 from "../assets/logo1.png";
const SEO = ({ blogData }) => {
  const {
    title,
    bookName,
    author,
    introduction,
    coverImage,
    categories,
    genres,
    urlSlug,
    readingTime,
    createdAt,
    updatedAt,
  } = blogData;

  const fullTitle = `${bookName} Summary - ${author} | Summary Bullets`;
  const url = `https://www.summarybullets.com/book-summary/${urlSlug}`;
  const keywords = [
    ...categories,
    ...genres,
    "book summary",
    "book review",
  ].join(", ");

  // Ensure dates are in ISO 8601 format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const publishedDate = formatDate(createdAt);
  const modifiedDate = formatDate(updatedAt);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta
        name="description"
        content={`Read a concise summary of "${bookName}" by ${author}. ${introduction.slice(
          0,
          80
        )}...`}
      />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={`Book summary of "${bookName}" by ${author}. Read key insights in ${readingTime} minutes.`}
      />
      <meta property="og:image" content={coverImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Summary Bullets" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={`Book summary of "${bookName}" by ${author}. Read key insights in ${readingTime} minutes.`}
      />
      <meta name="twitter:image" content={coverImage} />

      {/* Article Specific Tags */}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={author} />
      <meta property="article:section" content="Book Summaries" />
      {categories.map((category, index) => (
        <meta
          key={`category-${index}`}
          property="article:tag"
          content={category}
        />
      ))}
      {genres.map((genre, index) => (
        <meta key={`genre-${index}`} property="article:tag" content={genre} />
      ))}

      {/* Schema.org / Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://schema.org",
          "@type": "Article",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
          headline: `${bookName} Summary`,
          name: fullTitle,
          description: `Concise summary of "${bookName}" by ${author}. Key insights and main points condensed for quick reading.`,
          image: coverImage,
          author: {
            "@type": "Person",
            name: author,
          },
          publisher: {
            "@type": "Organization",
            name: "Summary Bullets",
            logo: {
              "@type": "ImageObject",
              url: logo1,
            },
          },
          datePublished: publishedDate,
          dateModified: modifiedDate,
          timeRequired: `PT${readingTime}M`,
          keywords: keywords,
          about: {
            "@type": "Book",
            name: bookName,
            author: {
              "@type": "Person",
              name: author,
            },
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
