# Netlify Deployment Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Netlify account

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Connect to Git Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Configure Build Settings**
   - Build command: `npm run build:web`
   - Publish directory: `dist`
   - Node version: `18`

3. **Deploy**
   - Netlify will automatically build and deploy your site
   - Every push to your main branch will trigger a new deployment

### Option 2: Manual Deployment

1. **Build the Project**
   ```bash
   npm install
   npm run build:web
   ```

2. **Deploy to Netlify**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login: `netlify login`
   - Deploy: `netlify deploy --prod --dir=dist`

## Configuration Files

- `netlify.toml`: Contains build settings and redirect rules
- `package.json`: Updated with build scripts
- `.gitignore`: Excludes build artifacts

## Features Included

- ✅ Single Page Application (SPA) routing
- ✅ Static asset optimization
- ✅ Security headers
- ✅ Cache optimization
- ✅ Mobile-responsive design

## Environment Variables

If your app uses environment variables:
1. Go to Site Settings > Environment Variables in Netlify
2. Add your variables (e.g., API endpoints)
3. Redeploy the site

## Custom Domain

1. Go to Site Settings > Domain Management
2. Add your custom domain
3. Configure DNS settings as instructed

## Troubleshooting

- **Build fails**: Check Node.js version (should be 18+)
- **Routing issues**: Ensure `netlify.toml` redirects are configured
- **Assets not loading**: Verify publish directory is set to `dist`

## Performance Optimization

- Images are optimized automatically
- JavaScript and CSS are minified
- Gzip compression is enabled
- CDN distribution worldwide