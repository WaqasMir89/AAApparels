export const company = {
  name: 'Amna Ashraf Apparels',
  shortName: 'AA Apparels',
  established: '1988',
  email: 'info@aaapparels.com',
  phone: '+92 21 32580350',
  phoneLink: '+922132580350',
  mobile: '+92 321 2878266',
  mobileLink: '+923212878266',
  whatsapp: 'https://wa.me/923212878266',
  address: 'F-748/H, Metroville, S.I.T.E., Karachi 75400, Pakistan',
  source: 'https://www.aaapparels.com/',
};

export const services = [
  {
    slug: 'designdevelopment',
    title: 'Design & development',
    short: 'From your first idea to a garment ready for production.',
    heading: 'Your vision.\nOur attention to detail.',
    image: 'service/researchanddevelopment.png',
    thumbnail: 'icon/Research and development.jpeg',
    intro: 'Every collection begins with an idea. We help turn yours into a considered, production-ready garment.',
    paragraphs: [
      'Starting with your tech pack, we review construction, shape and fit, then work through the materials and details that define the finished piece.',
      'Our team helps align fabric selection with comfort, durability and performance. Print placement, colour, labels, zippers, buttons and other trims are considered together, so every element works as part of the design.',
      'The process is collaborative: we discuss refinements before production to help resolve practical challenges while staying true to your brief.',
    ],
    points: ['Tech-pack & construction review', 'Fabric, fit & trim development', 'Print placement & colour coordination'],
    source: 'designdevelopment.php',
  },
  {
    slug: 'fabric',
    title: 'Fabric sourcing',
    short: 'The right knitted fabric, selected around your brief.',
    heading: 'Great garments\nbegin with the fabric.',
    image: 'service/fabrication2..png',
    thumbnail: 'icon/fabrication.png',
    intro: 'We work with an established network of partner mills to source knitted fabrics suited to your collection.',
    paragraphs: [
      'Fabric sourcing is coordinated with specialist mills; knitting is not performed in-house. This partnership model gives us flexibility across fabric types while supporting consistent quality and production planning.',
      'We inspect incoming fabrics and coordinate closely with suppliers to align each batch with the garment specification, design intent and agreed timeline.',
      'For projects with specific material or sustainability requirements, discuss the relevant standards and current supplier documentation with our team during development.',
    ],
    points: ['Knitted fabric sourcing', 'Supplier coordination & incoming inspection', 'Material selection for your garment specification'],
    source: 'fabric.php',
  },
  {
    slug: 'dyeing',
    title: 'Dyeing',
    short: 'Colour, character and hand feel, carefully considered.',
    heading: 'Colour that brings\nyour collection to life.',
    image: 'service/dyeinglong.png',
    thumbnail: 'icon/1.jpg.webp',
    intro: 'Fabric and garment dyeing, coordinated through specialist dye-house partners to suit the finish you have in mind.',
    paragraphs: [
      'We select the dyeing approach around the fabric, design and intended performance. Shade consistency, colourfastness and hand feel guide the process from development through production.',
      'Options described in our range include reactive dyeing for cotton jersey, pigment garment dyeing for a washed fleece finish, and piece dyeing for rib fabrics used in cuffs, collars and trims.',
      'Enzyme-assisted processes and acid dyeing for nylon/spandex blends can also be discussed as part of your material and finish requirements.',
    ],
    points: ['Fabric & garment dyeing', 'Reactive, pigment & piece-dyed finishes', 'Shade continuity & soft hand feel'],
    source: 'dyeing.php',
  },
  {
    slug: 'printingembroidery',
    title: 'Printing & embroidery',
    short: 'Distinctive artwork. Precise placement. A considered finish.',
    heading: 'The details that\nmake it yours.',
    image: 'service/printing and emb2.jpeg',
    thumbnail: 'icon/printing and emb2.jpeg',
    intro: 'Bring your artwork into the garment through printing and embroidery developed around your brand’s visual identity.',
    paragraphs: [
      'Our printing offering includes all-over printing, chest and placement prints, and heat transfers for detailed graphics and suitable low-temperature applications.',
      'Embroidery adds texture and definition to a garment. We consider the design, placement and intended finish together, with attention to consistency across the collection.',
      'From fashion and sportswear to branded apparel, our team works with your artwork to translate the creative brief into a finished piece.',
    ],
    points: ['All-over & placement printing', 'Heat-transfer applications', 'Embroidery & garment decoration'],
    source: 'printingembroidery.php',
  },
  {
    slug: 'productiondispatch',
    title: 'Production & dispatch',
    short: 'A coordinated journey from cutting table to final shipment.',
    heading: 'Made with care.\nPrepared for the world.',
    image: 'service/production and dispatched.png',
    thumbnail: 'icon/Production and dispatch.jpeg',
    intro: 'In-house cutting, stitching and finishing connect your approved design to a carefully prepared shipment.',
    paragraphs: [
      'Our production workflow brings fabric sourcing and garment operations into a coordinated process. Modular production lines accommodate different styles and product categories.',
      'Packing is arranged around your requirements, including flat-pack, hanger-pack and buyer-specific formats.',
      'For dispatch, we coordinate directly with freight forwarders and buyer logistics teams to support an organised handover.',
    ],
    points: ['In-house cutting, stitching & finishing', 'Flexible production-line arrangements', 'Buyer-specific packing & logistics coordination'],
    source: 'productiondispatch.php',
  },
];

export const collections = [
  { slug: 'mens', title: 'Men’s wear', name: 'Menswear', eyebrow: 'Everyday, elevated', description: 'T-shirts, pullovers and crewnecks for considered everyday collections.', image: 'productcatalogue/SHIRT1.jpg', source: 'mens.php' },
  { slug: 'ladies', title: 'Ladies’ wear', name: 'Womenswear', eyebrow: 'Comfort with character', description: 'Versatile knitted styles, from cotton T-shirts to soft fleece layers.', image: 'productcatalogue/hoodie2.jpg', source: 'ladies.php' },
  { slug: 'kids', title: 'Kids & teen', name: 'Kids & teen', eyebrow: 'Made for their everyday', description: 'Explore the T-shirt, hoodie and sweatshirt range for younger collections.', image: 'productcatalogue/swirt2 (3).jpg', source: 'kids.php' },
];

export const products = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `tee-${i + 1}`, name: 'Cotton T-shirt', type: 'tshirts', category: 'T-shirts',
    reference: String(i + 1).padStart(2, '0'), image: `productcatalogue/SHIRT${i + 1}.jpg`,
    detail: 'Composition & fabric weight confirmed during sampling',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `hoodie-${i + 1}`, name: 'Pullover hoodie', type: 'hoodies', category: 'Hoodies',
    reference: String(i + 1).padStart(2, '0'), image: `productcatalogue/hoodie${i + 1}.jpg`,
    detail: '70% cotton · 30% polyester · 280 GSM',
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `crewneck-${i + 1}`, name: 'Burnout crewneck', type: 'sweatshirts', category: 'Sweatshirts',
    reference: String(i + 1).padStart(2, '0'), image: `productcatalogue/swirt2 (${i + 1}).jpg`,
    detail: '65% cotton · 35% polyester · 280 GSM fleece',
  })),
];

export const faqs = [
  ['How do we get started?', 'Share a tech pack, reference sample or initial concept with our team. We can discuss your requirements and the next steps for development.'],
  ['What is a tech pack?', 'A document combining sketches or images with the specifications needed to develop and manufacture your garment.'],
  ['Can you support a full collection?', 'We offer support from development and sourcing through dyeing, decoration, cutting, sewing, finishing and packing.'],
  ['How does sampling work?', 'We review your brief, discuss a quotation, develop a sample and work through your feedback before production.'],
  ['What garments do you make?', 'Our range includes T-shirts, polos, hoodies, babywear, uniforms, loungewear and other knitted apparel.'],
];
