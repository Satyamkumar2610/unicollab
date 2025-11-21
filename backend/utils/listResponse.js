const buildListResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    metadata: {
      totalCount: total,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

module.exports = { buildListResponse };
