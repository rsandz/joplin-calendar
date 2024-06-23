import { SearchConstraints } from "./SearchConstraints";

interface SearchQueryProps {
  // Base search query string
  query: string;
  // Pagination
  page?: number;
  // Limit number of results
  limit?: number;
  // Which field to order by
  orderBy?: string;
  // Order direction
  orderDir?: "ASC" | "DESC";
  // Additional search constraints to apply
  searchConstraints?: SearchConstraints;
}

/**
 * Build search query to be used for Joplin's data API.
 */
export function buildSearchQuery(props: SearchQueryProps) {
  const { query, page, limit, orderBy, orderDir, searchConstraints } = props;
  let searchQueryString = query;
  const queryObject = {};

  if (searchConstraints?.notebook) {
    searchQueryString =
      searchQueryString + ` notebook:"${searchConstraints.notebook}"`;
  }

  if (limit) {
    queryObject["limit"] = limit;
  }

  if (orderBy) {
    queryObject["order_by"] = orderBy;
  }

  if (orderDir) {
    queryObject["order_dir"] = orderDir;
  }

  if (page) {
    queryObject["page"] = page;
  }

  return {
    ...queryObject,
    fields: ["id", "title", "user_created_time", "user_updated_time"],
    query: searchQueryString,
  };
}
