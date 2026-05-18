import re

with open("lib/data.ts", "r") as f:
    content = f.read()

# Revert the brands array to include BOTH old and new brands
old_brands = """export const brands: Brand[] = [
  {
    id: "johnson",
    name: "Johnson & Johnson",
    logo: "👁️",
    bannerImage: "/brands/acuvue.jpg",
    bannerBg: "from-blue-900 to-blue-600",
    tagline: "Gün boyu konfor, kristal berraklığında görüş",
  },
  {
    id: "bausch",
    name: "Bausch + Lomb",
    logo: "🔬",
    bannerImage: "/brands/bausch.jpg",
    bannerBg: "from-green-900 to-emerald-600",
    tagline: "150 yıllık göz sağlığı uzmanlığı",
  },
  {
    id: "alcon",
    name: "Alcon (Ciba Vision)",
    logo: "🔵",
    bannerImage: "/brands/dailies.jpg",
    bannerBg: "from-cyan-800 to-cyan-500",
    tagline: "Her gün taze başlangıç",
  },
  {
    id: "cooper",
    name: "Cooper Vision",
    logo: "💙",
    bannerImage: "/brands/biofinity.jpg",
    bannerBg: "from-indigo-900 to-indigo-600",
    tagline: "Aylık konforun en üst noktası",
  },
  {
    id: "tech",
    name: "Tech Contactlens",
    logo: "✨",
    bannerImage: "/brands/freshlook.jpg",
    bannerBg: "from-purple-900 to-pink-600",
    tagline: "Yenilikçi lens teknolojileri",
  },
  {
    id: "zeiss",
    name: "Zeiss (Wöhlk)",
    logo: "🔭",
    bannerImage: "/brands/airoptix.jpg",
    bannerBg: "from-sky-800 to-teal-500",
    tagline: "Alman optik kalitesi",
  },
  {
    id: "acuvue",
    name: "Acuvue",
    logo: "👁️",
    bannerImage: "/brands/acuvue.jpg",
    bannerBg: "from-blue-900 to-blue-600",
    tagline: "Gün boyu konfor, kristal berraklığında görüş",
  },
  {
    id: "dailies",
    name: "Dailies",
    logo: "🔵",
    bannerImage: "/brands/dailies.jpg",
    bannerBg: "from-cyan-800 to-cyan-500",
    tagline: "Her gün taze başlangıç",
  },
  {
    id: "biofinity",
    name: "Biofinity",
    logo: "💙",
    bannerImage: "/brands/biofinity.jpg",
    bannerBg: "from-indigo-900 to-indigo-600",
    tagline: "Aylık konforun en üst noktası",
  },
  {
    id: "freshlook",
    name: "FreshLook",
    logo: "✨",
    bannerImage: "/brands/freshlook.jpg",
    bannerBg: "from-purple-900 to-pink-600",
    tagline: "Renkli dünyaya hoş geldiniz",
  },
  {
    id: "airoptix",
    name: "Air Optix",
    logo: "🌬️",
    bannerImage: "/brands/airoptix.jpg",
    bannerBg: "from-sky-800 to-teal-500",
    tagline: "Nefes alan teknoloji, özgür gözler",
  },
];"""

content = re.sub(r"export const brands: Brand\[\] = \[\s*\{.*?\n\];", old_brands, content, flags=re.DOTALL)

# Revert brandIds for lenses based on their 'brand' field
lenses_block = re.search(r"export const lenses: Lens\[\] = \[(.*?)\];\n\nexport const reviews", content, flags=re.DOTALL).group(1)

new_lenses_block = lenses_block
new_lenses_block = re.sub(r'brand:\s*"Acuvue",\s*brandId:\s*"johnson"', 'brand: "Acuvue",\n    brandId: "acuvue"', new_lenses_block)
new_lenses_block = re.sub(r'brand:\s*"Dailies",\s*brandId:\s*"alcon"', 'brand: "Dailies",\n    brandId: "dailies"', new_lenses_block)
new_lenses_block = re.sub(r'brand:\s*"Biofinity",\s*brandId:\s*"cooper"', 'brand: "Biofinity",\n    brandId: "biofinity"', new_lenses_block)
new_lenses_block = re.sub(r'brand:\s*"FreshLook",\s*brandId:\s*"alcon"', 'brand: "FreshLook",\n    brandId: "freshlook"', new_lenses_block)
new_lenses_block = re.sub(r'brand:\s*"Air Optix",\s*brandId:\s*"alcon"', 'brand: "Air Optix",\n    brandId: "airoptix"', new_lenses_block)

content = content.replace(lenses_block, new_lenses_block)

with open("lib/data.ts", "w") as f:
    f.write(content)
