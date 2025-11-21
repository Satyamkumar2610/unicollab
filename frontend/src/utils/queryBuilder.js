export const buildQueryParams = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const buildListUrl = (baseUrl, { page, limit, search, sortBy, order, status, category, read }) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (status) params.status = status;
  if (category) params.category = category;
  if (read !== undefined) params.read = read;
  
  const queryString = buildQueryParams(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};
