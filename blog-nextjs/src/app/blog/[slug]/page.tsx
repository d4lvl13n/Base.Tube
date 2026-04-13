import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';
import BlogArticle from '@/components/v2/blog/BlogArticle';
import {
  getPostBySlug,
  getAllPostSlugs,
  getFeaturedImageUrl,
  getCleanTitle,
  getSeoTitle,
  getSeoDescription,
  generateKeywords,
  calculateReadingTime,
  getCategories,
  getTags,
} from '@/lib/wordpress';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Base.Tube Blog',
    };
  }

  const cleanTitle = getCleanTitle(post);
  const seoTitle = getSeoTitle(post);
  const seoDescription = getSeoDescription(post);
  const featuredImage = getFeaturedImageUrl(post);
  const dynamicKeywords = generateKeywords(post);
  const readingTime = calculateReadingTime(post.content.rendered);

  const metaDescription =
    seoDescription.length > 155
      ? seoDescription.slice(0, 155).trim() + '...'
      : seoDescription;

  const pageTitle = post.meta?.rank_math_title ? seoTitle : cleanTitle;

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: dynamicKeywords,
    authors: [{ name: 'Base.Tube Team', url: 'https://base.tube' }],
    openGraph: {
      title: seoTitle,
      description: metaDescription,
      type: 'article',
      url: `https://base.tube/blog/${resolvedParams.slug}`,
      siteName: 'Base.Tube',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ['Base.Tube Team'],
      section: getCategories(post)[0]?.name || 'Web3',
      tags: getTags(post).map((t) => t.name),
      images: [
        {
          url: featuredImage.startsWith('http')
            ? featuredImage
            : `https://base.tube${featuredImage}`,
          width: 1200,
          height: 630,
          alt: cleanTitle,
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@base_tube',
      creator: '@base_tube',
      title: seoTitle,
      description: metaDescription,
      images: [
        featuredImage.startsWith('http')
          ? featuredImage
          : `https://base.tube${featuredImage}`,
      ],
    },
    alternates: {
      canonical: `https://base.tube/blog/${resolvedParams.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    other: {
      'article:published_time': post.date,
      'article:modified_time': post.modified || post.date,
      'article:author': 'Base.Tube Team',
      reading_time: `${readingTime} min`,
    },
  };
}

export default async function BlogV2PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const cleanTitle = getCleanTitle(post);
  const postUrl = `https://base.tube/blog/${resolvedParams.slug}`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://base.tube' },
    { name: 'Blog', url: 'https://base.tube/blog' },
    { name: cleanTitle, url: postUrl },
  ];

  return (
    <>
      <ArticleStructuredData post={post} url={postUrl} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogArticle post={post} slug={resolvedParams.slug} />
    </>
  );
}
