require("dotenv").config();
const Sequelize = require("sequelize");
const { sequelize } = require("../config/db");

const User = require("./User");
const Admin = require("./Admin");
const Category = require("./Category");
const CategoryType = require("./CategoryType");
const Course = require("./Course");
const Achievement = require("./Achievement");
const CareerCounselling = require("./CareerCounselling");
const FreeResource = require("./FreeResource");
const CourseMaterial = require("./CourseMaterial");
const CareerCounsellingForm = require("./CareerCounsellingForm");
const FreeResourceMaterial = require("./FreeResourceMaterials");
const Banner = require("./Banner");
// ------------------- Associations ------------------- //

// -------- CategoryType Associations -------- //

CategoryType.hasMany(Category, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeCategories",
});
Category.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "categoryCategoryType",
});

CategoryType.hasMany(Achievement, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeAchievements",
});
Achievement.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "achievementCategoryType",
});

CategoryType.hasMany(Course, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeCourses",
});
Course.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "courseCategoryType",
});

CategoryType.hasMany(CareerCounselling, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeCareerCounsellings",
});
CareerCounselling.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "careerCounsellingCategoryType",
});

CategoryType.hasMany(FreeResource, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeFreeResources",
});
FreeResource.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "freeResourceCategoryType",
});

CategoryType.hasMany(FreeResourceMaterial, {
  foreignKey: "categoryTypeId",
  as: "categoryTypeFreeResourceMaterials",
});
FreeResourceMaterial.belongsTo(CategoryType, {
  foreignKey: "categoryTypeId",
  as: "freeResourceMaterialCategoryType",
});

// -------- Category Associations -------- //

Category.hasMany(Achievement, {
  foreignKey: "categoryId",
  as: "categoryAchievements",
});
Achievement.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "achievementCategory",
});

Category.hasMany(CourseMaterial, {
  foreignKey: "categoryId",
  as: "categoryCourseMaterials",
});
CourseMaterial.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "courseMaterialCategory",
});

Category.hasMany(CareerCounselling, {
  foreignKey: "categoryId",
  as: "categoryCareerCounsellings",
});
CareerCounselling.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "careerCounsellingCategory",
});

Category.hasMany(FreeResource, {
  foreignKey: "categoryId",
  as: "categoryFreeResources",
});
FreeResource.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "freeResourceCategory",
});

Category.hasMany(CareerCounsellingForm, {
  foreignKey: "categoryId",
  as: "categoryCareerCounsellingForms",
});
CareerCounsellingForm.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "careerCounsellingFormCategory",
});

Category.hasMany(FreeResourceMaterial, {
  foreignKey: "categoryId",
  as: "categoryFreeResourceMaterials",
});
FreeResourceMaterial.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "freeResourceMaterialCategory",
});

// -------- Course Associations -------- //

Course.hasMany(CourseMaterial, {
  foreignKey: "courseId",
  as: "courseCourseMaterials",
});
CourseMaterial.belongsTo(Course, {
  foreignKey: "courseId",
  as: "courseMaterialCourse",
});

// -------- FreeResource Associations -------- //

FreeResource.hasMany(FreeResourceMaterial, {
  foreignKey: "freeResourceId",
  as: "freeResourceMaterials",
});
FreeResourceMaterial.belongsTo(FreeResource, {
  foreignKey: "freeResourceId",
  as: "materialFreeResource",
});

// ------------------- Exports ------------------- //

module.exports = {
  sequelize,
  Sequelize,
  User,
  Admin,
  Category,
  CategoryType,
  Course,
  FreeResource,
  FreeResourceMaterial,
  Achievement,
  CareerCounselling,
  CourseMaterial,
  CareerCounsellingForm,
  Banner,
};
