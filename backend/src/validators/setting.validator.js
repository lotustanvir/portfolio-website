import { body } from "express-validator";

export const updateSettingsRules = [
  body("siteTitle")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Site title must be at most 200 characters"),
  body("siteDescription")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Site description must be at most 500 characters"),
  body("seoTitle")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("SEO title must be at most 200 characters"),
  body("seoDescription")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("SEO description must be at most 500 characters"),
  body("heroTitle")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Hero title must be at most 200 characters"),
  body("heroSubtitle")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Hero subtitle must be at most 500 characters"),
  body("heroImage")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Hero image must be a string"),
  body("about")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("About must be a string"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 30 })
    .withMessage("Phone must be at most 30 characters"),
  body("location")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must be at most 200 characters"),
  body("github")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("GitHub must be a valid URL"),
  body("linkedin")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),
  body("facebook")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Facebook must be a valid URL"),
  body("instagram")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Instagram must be a valid URL"),
  body("resumeUrl")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Resume URL must be a string"),
  body("themeColor")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)
    .withMessage("Theme color must be a valid hex color (e.g., #FF5733)"),
  body("logo")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Logo must be a string"),
  body("favicon")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Favicon must be a string"),
];
