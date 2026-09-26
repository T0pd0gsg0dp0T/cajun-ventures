# C2 Land Works Website

Professional static website for C2 Land Works, a land clearing and excavation company based in Winnie, TX.

## Features

- **Services showcase** with interactive cost calculator
- **Project gallery** with filtering by category
- **Equipment catalog** with detailed descriptions
- **Quote request forms** with Netlify Forms integration
- **Customer testimonials**
- **FAQ with accordion interface**
- **Before/after comparison sliders**
- **Mobile-responsive design**

## Tech Stack

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools
- **Netlify Forms** - Contact and quote submissions
- **Responsive design** - Mobile-first with multiple breakpoints

## Project Structure

```
c2landworks/
├── index.html           # Homepage
├── services.html        # Services with cost calculator
├── gallery.html         # Filterable photo gallery
├── contact.html         # Contact form
├── quote.html           # Quote request form
├── about.html           # Company information
├── equipment.html       # Equipment showcase
├── testimonials.html    # Customer reviews
├── css/
│   └── styles.css       # Single stylesheet (~2400 lines)
├── js/
│   └── main.js          # All JavaScript (~680 lines)
└── images/
    ├── gallery/         # Project photos
    └── equipment/       # Equipment photos
```

## Development

### Local Preview

```bash
# Option 1: Direct file opening
open index.html

# Option 2: Local server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### No Build Process

All files are production-ready as-is. No compilation or bundling required.

## Deployment

Configured for **Netlify** deployment:

- Forms use `data-netlify="true"` attribute
- Honeypot spam protection enabled
- Production URL: https://c2landworks.com

## Design System

### Colors
- **Primary**: `#ff6a00` (orange gradient with `#ff3d00`)
- **Dark backgrounds**: `#0a0a0a` to `#2d2d2d`
- **Accents**: Orange gradients throughout

### Typography
- **Headings**: Oswald
- **Body**: Inter

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large**: 1200px

## JavaScript Components

All functionality in `js/main.js`:
- `initHeader()` - Sticky header with scroll effects
- `initMobileMenu()` - Hamburger menu toggle
- `initGalleryFilter()` - Gallery filtering by category
- `initComparisonSlider()` - Before/after image slider
- `initFAQ()` - Accordion component
- `initForms()` - Netlify form submission with validation
- `initCalculator()` - Cost estimation calculator
- `initLightbox()` - Image lightbox for gallery

## Forms

Forms POST to `/` with Netlify Forms backend:
- Contact form: General inquiries
- Quote form: Project estimates
- All forms include validation and spam protection

## Business Information

- **Company**: C2 Land Works
- **Phone**: (409) 617-1161
- **Email**: c2landworks@yahoo.com
- **Owner**: Tony Cammareri
- **Service Area**: Southeast Texas (Chambers, Jefferson, Liberty counties)

### Services

- Land clearing
- Brush hogging
- Excavation
- Grading
- Pond construction
- Demolition
- Driveway installation

## License

Proprietary - For C2 Land Works only.
