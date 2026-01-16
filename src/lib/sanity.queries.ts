// GROQ Queries for Sanity

// Get all products
export const allProductsQuery = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  images[]{
    asset->{
      _id,
      url
    }
  },
  stock,
  featured,
  bestseller,
  "new": new,
  seoTitle,
  seoDescription,
  _createdAt,
  _updatedAt
}`;

// Get single product by slug
export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  images[]{
    asset->{
      _id,
      url
    }
  },
  stock,
  featured,
  bestseller,
  "new": new,
  seoTitle,
  seoDescription,
  _createdAt,
  _updatedAt
}`;

// Get featured products
export const featuredProductsQuery = `*[_type == "product" && featured == true] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  images[]{
    asset->{
      _id,
      url
    }
  },
  stock,
  featured,
  bestseller,
  "new": new,
  _createdAt
}`;

// Get products by category
export const productsByCategoryQuery = `*[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  images[]{
    asset->{
      _id,
      url
    }
  },
  stock,
  featured,
  bestseller,
  "new": new,
  _createdAt
}`;

// Get all categories
export const allCategoriesQuery = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  slug,
  description
}`;

// Search products
export const searchProductsQuery = `*[_type == "product" && (name match $searchTerm || description match $searchTerm)] | order(_createdAt desc) {
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  images[]{
    asset->{
      _id,
      url
    }
  },
  stock,
  featured,
  bestseller,
  "new": new,
  _createdAt
}`;

