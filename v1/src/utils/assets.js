// src/utils/assets.js
const allAssets = import.meta.glob(
  '../assets/**/*.{png,jpg,jpeg,svg,pdf}',
  { eager: true }
)

const assets = {}
Object.entries(allAssets).forEach(([filePath, module]) => {
  // filePath might be "../assets/resume/resume.pdf"
  const filename = filePath.split('/').pop() // e.g. "resume.pdf"
  assets[filename] = module.default         // module.default → "/assets/resume.abc123.pdf"
})

export default assets
