# Financial Calendar Tool

A free, client-side financial planning tool that helps you match your paychecks to bills and expenses. All data is stored locally in your browser - no backend, no tracking, completely free.

## Features

- **Interactive Calendar View** - Visual calendar showing income and expense days with running balance
- **Income Tracking** - Add expected paychecks with dates and amounts
- **Expense Management** - Track bills and expenses with due dates, categories, and recurring options
- **Smart Matching** - Automatically calculates which paychecks should be used for which bills
- **Balance Projection** - See your projected balance day-by-day
- **Data Export/Import** - Export to JSON or CSV, import your data back
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the production-ready files.

## Deployment

This app is a static site and can be deployed to any static hosting service:

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Or connect your Git repository to Netlify for automatic deployments

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### GitHub Pages

1. Build the project: `npm run build`
2. Configure the `base` in `vite.config.ts` to your repository name
3. Use GitHub Actions or manually push the `dist` folder to the `gh-pages` branch

### Custom Domain

After deploying, you can add a custom domain in your hosting provider's settings. Point your domain's DNS to your hosting provider.

## How to Use

1. **Add Income**: Click "Add Income" and enter when you expect paychecks, the date, and amount
2. **Add Expenses**: Click "Add Expense" and enter your bills with due dates and amounts
3. **View Calendar**: See all your income and expenses on the calendar with running balance
4. **Calculate Match**: Click "Calculate Match" to see which paychecks should pay which bills
5. **Export Data**: Regularly export your data to prevent loss (data is stored in browser localStorage)

## Data Storage

All data is stored locally in your browser's localStorage. This means:
- No server costs
- No tracking or analytics
- Complete privacy
- Data is device-specific (not synced across devices)
- Clearing browser data will delete your information

**Always export your data regularly!**

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **localStorage** - Data persistence

## Browser Support

Modern browsers that support:
- ES2020 features
- localStorage API
- CSS Grid and Flexbox

## License

Free to use and modify. No restrictions.

## Contributing

Feel free to fork, modify, and use this project for your own needs. If you make improvements, consider sharing them back!

## Support

This is a free tool with no official support. Use at your own discretion. Always verify calculations manually for important financial decisions.

