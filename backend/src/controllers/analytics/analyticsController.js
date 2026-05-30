const analyticsService = require('../../services/analyticsService');
const ApiResponse = require('../../utils/ApiResponse');

exports.getOverview = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardOverview();
    res.status(200).json(new ApiResponse(200, stats, 'Dashboard performance aggregated successfully'));
  } catch (error) {
    next(error);
  }
};
