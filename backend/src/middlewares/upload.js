import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { ValidationError } from "../errors/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certificatesDir = path.resolve(__dirname, "../../uploads/certificates");
const resumesDir = path.resolve(__dirname, "../../uploads/resumes");

function createStorage(dir) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
}

const imageFilter = (_req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new ValidationError("Only jpg, jpeg, png, webp, and gif images are allowed"), false);
  }
  cb(null, true);
};

const pdfFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf") {
    return cb(new ValidationError("Only PDF files are allowed"), false);
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage: createStorage(certificatesDir),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const uploadPdf = multer({
  storage: createStorage(certificatesDir),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("pdf");

export const uploadResumePdf = multer({
  storage: createStorage(resumesDir),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("resume");

export function handleUploadError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: { message: "File too large" },
        timestamp: new Date().toISOString(),
      });
    }
    return res.status(400).json({
      success: false,
      error: { message: err.message },
      timestamp: new Date().toISOString(),
    });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: { message: err.message },
      timestamp: new Date().toISOString(),
    });
  }
  next(err);
}
