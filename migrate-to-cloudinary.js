require('dotenv').config(); // Load .env from backend root
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Verify env vars are loaded
if (!process.env.CLOUDINARY_NAME) {
    console.error('❌ CLOUDINARY_NAME not set. Check your .env file.');
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SERVER_URL = 'https://ckdarjipanel.in';
// ← adjust this path to where your uploads actually are on your machine
const UPLOADS_BASE = path.join(__dirname, 'public', 'uploads');
const urlMap = {};

async function uploadFile(filePath, folder, resourceType = 'image') {
    const filename = path.basename(filePath);
    // Remove extension for public_id, replace spaces with underscores
    const publicId = filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `ck-darji/${folder}`,
            public_id: publicId,
            resource_type: resourceType,
            overwrite: false,
            use_filename: true,
            unique_filename: true,
        });
        const oldUrl = `${SERVER_URL}/uploads/${folder}/${filename}`;
        urlMap[oldUrl] = result.secure_url;
        console.log(`✅ ${filename}`);
        return result.secure_url;
    } catch (err) {
        // err.message is undefined when cloudinary returns an error object differently
        const msg = err?.message || err?.error?.message || JSON.stringify(err);
        console.error(`❌ ${filename}: ${msg}`);
        return null;
    }
}

async function processDir(dirPath, folder, resourceType = 'image') {
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directory not found: ${dirPath}`);
        return;
    }
    const files = fs.readdirSync(dirPath).filter(f =>
        /\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(f)
    );
    console.log(`\nUploading ${files.length} files from ${folder}...`);
    for (const file of files) {
        await uploadFile(path.join(dirPath, file), folder, resourceType);
        await new Promise(r => setTimeout(r, 300)); // avoid rate limit
    }
}

async function main() {
    console.log(`☁️  Cloudinary cloud: ${process.env.CLOUDINARY_NAME}`);
    console.log(`📁 Uploads base: ${UPLOADS_BASE}\n`);

    await processDir(path.join(UPLOADS_BASE, 'images'), 'images', 'image');
    await processDir(path.join(UPLOADS_BASE, 'pdfs'), 'pdfs', 'raw');

    const uploadedCount = Object.keys(urlMap).length;
    console.log(`\n✅ ${uploadedCount} files uploaded.`);

    if (uploadedCount === 0) {
        console.log('⚠️  No files uploaded. Check UPLOADS_BASE path and Cloudinary credentials.');
        return;
    }

    // Build SQL UPDATE for Neon DB
    const buildCaseBlock = (col) =>
        Object.entries(urlMap)
            .map(([old, nw]) => `  WHEN (${col}->>'path') = '${old.replace(/'/g, "''")}' THEN '{"name":"${path.basename(old).replace(/'/g, "''")}","path":"${nw.replace(/'/g, "''")}","type":"image"}'::json`)
            .join('\n');

    // For plain varchar columns (Courses.video is already YouTube, skip)
    const sql = `
-- ============================================================
-- Run this on Neon after Cloudinary migration
-- Generated: ${new Date().toISOString()}
-- ============================================================

-- Banners (media is JSON: {"name":..,"path":..,"type":..})
UPDATE "Banners"
SET media = CASE
${buildCaseBlock('media')}
  ELSE media
END
WHERE media->>'path' LIKE '%ckdarjipanel.in%';

-- CourseMaterials
UPDATE "CourseMaterials"
SET media = CASE
${buildCaseBlock('media')}
  ELSE media
END
WHERE media->>'path' LIKE '%ckdarjipanel.in%';

-- Achievements
UPDATE "Achievements"
SET media = CASE
${buildCaseBlock('media')}
  ELSE media
END
WHERE media->>'path' LIKE '%ckdarjipanel.in%';

-- CareerCounsellings
UPDATE "CareerCounsellings"
SET media = CASE
${buildCaseBlock('media')}
  ELSE media
END
WHERE media->>'path' LIKE '%ckdarjipanel.in%';

-- FreeResourceMaterials
UPDATE "FreeResourceMaterials"
SET media = CASE
${buildCaseBlock('media')}
  ELSE media
END
WHERE media->>'path' LIKE '%ckdarjipanel.in%';

-- Verify (all should return 0)
SELECT 'Banners' AS tbl, COUNT(*) AS remaining FROM "Banners" WHERE media->>'path' LIKE '%ckdarjipanel.in%'
UNION ALL SELECT 'CourseMaterials', COUNT(*) FROM "CourseMaterials" WHERE media->>'path' LIKE '%ckdarjipanel.in%'
UNION ALL SELECT 'Achievements', COUNT(*) FROM "Achievements" WHERE media->>'path' LIKE '%ckdarjipanel.in%'
UNION ALL SELECT 'CareerCounsellings', COUNT(*) FROM "CareerCounsellings" WHERE media->>'path' LIKE '%ckdarjipanel.in%'
UNION ALL SELECT 'FreeResourceMaterials', COUNT(*) FROM "FreeResourceMaterials" WHERE media->>'path' LIKE '%ckdarjipanel.in%';
`;

    fs.writeFileSync('update_db_urls.sql', sql);
    fs.writeFileSync('url_map.json', JSON.stringify(urlMap, null, 2));
    console.log('📄 update_db_urls.sql written — run on Neon DB.');
}

main().catch(console.error);