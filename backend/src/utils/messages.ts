export const MESSAGES = {
  server: {
    serverError: "internal server error",
  },

  analytics: {
    failedToFetch: "Failed to fetch analytics data.",
    invalidFilter: "Invalid filter provided. Use 'day', 'month', or 'year'.",
    missingFilter: "Filter parameter is required.",
    missingDoctorId: "Doctor ID is required for this request.",
    databaseError: "Failed to query analytics data from the database.",
    notFound: "Analytics data not found.",
  },

  user: {
    notFound: "Article not found",
    articlesFetched: "Articles fetched successfully",
    articleFetched: "Article fetched successfully",
    likeSuccess: "Article liked successfully",
    dislikeSuccess: "Article disliked successfully",
    articleDeleted: "Article deleted successfully",
  },
  doctor: {},

  admin: {},
};
