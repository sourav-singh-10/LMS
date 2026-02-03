# SeerBharat.org Integration Guide

This guide provides step-by-step instructions for integrating the LMS button and Chatbot components directly into the seerbharat.org website codebase.

## Overview

The integration package includes:
- `ChatbotForSeerbharat.jsx` - A standalone chatbot component
- `LMSButtonForSeerbharat.jsx` - A standalone LMS button component
- `index.js` - Exports both components for easy importing

## Integration Steps

### Step 1: Copy Integration Files

Copy the entire `integration` folder from this project to your seerbharat.org project:

```
src/
└── integration/
    ├── ChatbotForSeerbharat.jsx
    ├── LMSButtonForSeerbharat.jsx
    └── index.js
```

### Step 2: Import Components in Your Homepage

In your seerbharat.org homepage component (likely `pages/index.js` or similar), import the components:

```jsx
import { ChatbotForSeerbharat, LMSButtonForSeerbharat } from '../integration';
```

### Step 3: Add Components to Your Layout

#### For the LMS Button:
Add the LMS button in your navigation menu or a prominent location on your homepage:

```jsx
// Example placement in a navigation component
function Navigation() {
  return (
    <nav className="main-navigation">
      {/* Your existing navigation items */}
      <div className="nav-item">
        <LMSButtonForSeerbharat lmsUrl="https://lms.seerbharat.org" />
      </div>
    </nav>
  );
}
```

#### For the Chatbot:
Add the chatbot component at the bottom of your layout component:

```jsx
function Layout({ children }) {
  return (
    <div className="site-layout">
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatbotForSeerbharat />
    </div>
  );
}
```

### Step 4: Customize Component Props (Optional)

Both components accept props for customization:

#### LMS Button Props:
- `lmsUrl` - URL to your LMS platform (default: 'https://lms.seerbharat.org')

```jsx
<LMSButtonForSeerbharat lmsUrl="https://custom-lms-url.seerbharat.org" />
```

#### Chatbot Component
The chatbot component is self-contained and doesn't require additional props for basic functionality.

### Step 5: Test the Integration

After adding the components to your seerbharat.org codebase:

1. Start your development server
2. Verify the LMS button appears in the designated location
3. Check that the chatbot toggle button appears in the bottom-right corner
4. Test the chatbot functionality by clicking the toggle button and interacting with it

## Troubleshooting

### Issue: Components not rendering
- Ensure the import paths are correct
- Check for any console errors
- Verify that React is properly set up in your project

### Issue: Styling conflicts
If you encounter styling conflicts:

1. Open the component files
2. Modify the CSS class names to be more specific
3. Adjust the styling as needed to match your website's design

### Issue: Phosphor icons not loading
The chatbot uses Phosphor icons which are loaded via CDN. If icons don't appear:

1. Check your network connection
2. Ensure your website allows loading external scripts
3. Consider downloading and bundling the Phosphor icons with your project

## Additional Customization

### Modifying Chatbot Content

To modify the chatbot's conversation flow and content:

1. Open `ChatbotForSeerbharat.jsx`
2. Locate the `chatData` object
3. Modify the messages, options, and redirects as needed

### Changing the LMS Button Style

To change the LMS button's appearance:

1. Open `LMSButtonForSeerbharat.jsx`
2. Modify the CSS in the `styleElement.textContent` section

## Support

For additional support or customization needs, please contact the development team.