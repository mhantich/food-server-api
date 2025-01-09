const Meal = require("../models/Meal");
const redis = require('../utils/redis');

const getMeals = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isPopular,
      sortBy,
    } = req.query;

    const query = {};
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isPopular) {
      query.isPopular = isPopular === 'true';
    }

    let sortField = '-createdAt';
    if (sortBy) {
      const sortMapping = {
        pricelow: 'price',
        pricehigh: '-price',
        nameasc: 'name',
        namedesc: '-name',
        default: '-createdAt',
      };
      sortField = sortMapping[sortBy] || sortMapping.pricelow;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const meals = await Meal.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort(sortField);

    const total = await Meal.countDocuments(query);

    res.status(200).json({
      meals,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in getMeals:', error);
    res.status(500).json({
      message: 'Error fetching meals',
      error: error.message,
    });
  }
};

module.exports = {
  getMeals,
};