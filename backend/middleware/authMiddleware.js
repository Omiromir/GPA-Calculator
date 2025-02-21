// backend/middleware/authMiddleware.js
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  // Пытаемся получить userId из заголовков (например, 'user-id')
  const userId = req.headers['user-id']; // Изменяем на заголовок, который будет отправляться с фронтенда

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Прикрепляем пользователя к запросу
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = authMiddleware;