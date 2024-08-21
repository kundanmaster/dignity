// src/lib/fontawesome.ts
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS

// Add icons to the library for global usage
library.add(fas, fab);
