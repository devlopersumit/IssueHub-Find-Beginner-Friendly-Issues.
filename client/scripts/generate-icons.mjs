import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(process.cwd())
const srcSvg = path.join(root, 'public', 'logo.svg')
const outDir = path.join(root, 'public')

const sizes = [16, 32, 48, 64, 192, 512]

async function run() {
  const svgBuffer = await readFile(srcSvg)

  // Generate generic favicon.png (64x64)
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(outDir, 'favicon.png'))

  // Common sizes
  for (const size of sizes) {
    const name = size === 16 || size === 32 ? `favicon-${size}x${size}.png` : `icon-${size}x${size}.png`
    await sharp(svgBuffer).resize(size, size).png().toFile(path.join(outDir, name))
  }

  console.log('Generated PNG icons from SVG logo in /public')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})


