import { createId } from '../utils/id.js';

const botanicalId = createId('collection');
const tidalId = createId('collection');
const chromaticId = createId('collection');
const contactEmailId = createId('contact');
const contactPhoneId = createId('contact');
const contactLinkedInId = createId('contact');
const contactInstagramId = createId('contact');

const buildMetadata = (entries) =>
  entries.map(({ label, value }) => ({ id: createId('meta'), label, value }));

const buildGallery = (images) =>
  images.map(({ src, alt }) => ({ id: createId('image'), src, alt }));

export const defaultData = {
  settings: {
    adminPassword: '',
    siteTitle: 'Coral Dias',
    logo: '',
    watermarkEnabled: true,
    watermarkText: 'coraldias.co.uk',
    watermarkOpacity: 0.12,
    watermarkScale: 1
  },
  home: {
    eyebrow: 'Surface pattern dias',
    title: 'Tailored fashion prints distilled from tidal botanica',
    description:
      'Coral Dias is the print practice of Isla Marin, blending hand-painted botanicals, underwater photography, and experimental dye labs into couture-ready surfaces. Each commission braids ocean narratives with tactile color stories for runway, resort, and editorial collaborators.',
    ribbonText: 'Limited print editions',
    primaryCta: {
      label: 'Explore portfolio',
      href: '/portfolio'
    },
    secondaryCta: {
      label: 'Meet the designer',
      href: '/about'
    },
    heroImage:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80'
  },
  contact: {
    eyebrow: 'Collaborate',
    title: "Let's craft something unforgettable",
    description:
      'Reach out directly for commissions, licensing conversations, or to follow my studio journals across the web.',
    entries: [
      {
        id: contactEmailId,
        label: 'Email',
        value: 'hello@coralatelier.studio'
      },
      {
        id: contactPhoneId,
        label: 'Mobile',
        value: '+44 7700 900123',
        displayValue: '+44 7700 900123',
        note: 'Available weekdays 9am – 5pm GMT'
      },
      {
        id: contactLinkedInId,
        label: 'LinkedIn',
        value: 'https://www.linkedin.com/in/coraldias',
        note: 'Studio process notes and project snapshots'
      },
      {
        id: contactInstagramId,
        label: 'Instagram',
        value: 'https://www.instagram.com/coral.prints',
        note: 'Daily sketchbooks and underwater palettes'
      }
    ]
  },
  about: {
    eyebrow: 'About Isla Marin',
    title: 'Printmaking rituals rooted in coastal botanics',
    paragraphs: [
      'Isla Marin is a fashion print designer translating tidal ecosystems into tactile couture narratives. Her process begins with dawn dives and pressed specimens, then flows through gouache washes, analog collage, and digital compositing to orchestrate collections with luminous depth.',
      'Across bespoke textiles, limited edition scarves, and immersive runway projections, Isla layers coral-inspired palettes with experimental surface techniques. She collaborates with regenerative farms and artisanal mills to ensure every pattern supports circular material stories.'
    ],
    capabilities: [
      'Hand-painted and digital textile print suites',
      'Color story development & collection direction',
      'Lookbook art direction and motion treatments',
      'Custom illustration for resort, bridal, and ready-to-wear'
    ],
    stats: [
      { id: createId('stat'), value: '28', label: 'Runway capsules outfitted' },
      { id: createId('stat'), value: '16', label: 'Editorial covers featuring her prints' },
      { id: createId('stat'), value: '42', label: 'Botanical species catalogued for palettes' },
      { id: createId('stat'), value: '12', label: 'Residencies at coastal design labs' }
    ]
  },
  portfolio: {
    introTitle: 'Portfolio',
    introDescription:
      'Signature projects spanning resort collections, couture collaborations, and artful product capsules. Select a collection to immerse in its layered imagery and tactile storytelling.',
    filtersLabel: 'Collections'
  },
  collections: [
    {
      id: botanicalId,
      name: 'Botanical Reverie',
      description: 'Velvet botanicals painted under moonlight, translated into sweeping gowns for celestial soirées.',
      mood: 'Opaline florals, midnight indigos, silver leaf',
      heroImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: tidalId,
      name: 'Tidal Lumina',
      description: 'Liquid gradients inspired by tidepool refractions, crafted for resort silhouettes and silk separates.',
      mood: 'Iridescent teals, coral blush, sun-faded saffron',
      heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: chromaticId,
      name: 'Chromatic Echo',
      description: 'Architectural motifs echoing Art Deco coastlines, rendered in richly layered jacquards and prints.',
      mood: 'Gilded ochre, saltstone neutrals, obsidian ink',
      heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80'
    }
  ],
  projects: [
    {
      id: createId('project'),
      title: 'Moonlit Botanica',
      tagline: 'Gouache florals with luminescent foil veiling',
      collectionId: botanicalId,
      coverImage:
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
      description:
        'A couture print story for Luna Atelier’s winter gala capsule. Each panel begins as midnight-hued gouache blooms layered with silver leaf impressions, then digitized for scale-play across gowns, gloves, and silk veils.',
      gallery: buildGallery([
        {
          src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
          alt: 'Close-up of botanical print with metallic details'
        },
        {
          src: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1600&q=80',
          alt: 'Runway look featuring flowing floral gown'
        },
        {
          src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80',
          alt: 'Detail of layered petals on silk fabric'
        }
      ]),
      metadata: buildMetadata([
        { label: 'Client', value: 'Luna Dias' },
        { label: 'Year', value: '2024' },
        { label: 'Techniques', value: 'Hand-painted gouache, foil stamping, digital overprint' },
        { label: 'Deliverables', value: 'Runway textile suite, print bible, bespoke linings' }
      ])
    },
    {
      id: createId('project'),
      title: 'Tidepool Tapestry',
      tagline: 'Gradient silks inspired by tidal refractions',
      collectionId: tidalId,
      coverImage:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
      description:
        'Resort capsule for Mare & Co. featuring cascading silk caftans, swimwear, and accessories. Isla captured tidepool light studies underwater, transforming them into layered gradients with hand-inked contour lines.',
      gallery: buildGallery([
        {
          src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80',
          alt: 'Silk fabric with teal and coral gradient print'
        },
        {
          src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80',
          alt: 'Model wearing flowing printed resort wear'
        },
        {
          src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80',
          alt: 'Detail of layered watercolor strokes on textile'
        }
      ]),
      metadata: buildMetadata([
        { label: 'Client', value: 'Mare & Co.' },
        { label: 'Year', value: '2023' },
        { label: 'Techniques', value: 'Underwater photography, digital gradient mapping, silk-screen overlays' },
        { label: 'Deliverables', value: 'Resort wear textile collection, swim accessories, lookbook direction' }
      ])
    },
    {
      id: createId('project'),
      title: 'Chromatic Bloom',
      tagline: 'Architectural petals for avant-garde silhouettes',
      collectionId: chromaticId,
      coverImage:
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80',
      description:
        'Collaboration with architect Lina Ortiz for a gallery installation merging structured garments and projected lightscapes. Isla translated Art Deco coastlines into geometric florals with stitched metallic threads.',
      gallery: buildGallery([
        {
          src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80',
          alt: 'Geometric print swatches with metallic sheen'
        },
        {
          src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
          alt: 'Structured garment with bold angular pattern'
        },
        {
          src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
          alt: 'Projected light patterns over textile installation'
        }
      ]),
      metadata: buildMetadata([
        { label: 'Client', value: 'Lina Ortiz Studio' },
        { label: 'Year', value: '2022' },
        { label: 'Techniques', value: 'Vector drafting, metallic thread embroidery, projection mapping' },
        { label: 'Deliverables', value: 'Exhibition textiles, sculptural garments, motion projections' }
      ])
    }
  ]
};

export const getDefaultData = () => JSON.parse(JSON.stringify(defaultData));
