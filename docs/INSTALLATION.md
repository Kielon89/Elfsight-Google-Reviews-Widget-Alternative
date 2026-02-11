# 📦 Installation Guide

## Prerequisites
- A GitHub account.
- A Google Cloud account (for the API Key).
- A valid Google Place ID.

## Step 1: Fork & Repository Setup

1.  **Fork this Repository**: Click the "Fork" button at the top right of this page.
2.  **Enable Actions**: Go to your forked repository's **Actions** tab and click "I understand my workflows, go ahead and enable them".
3.  **Enable Pages**: 
    - Go to **Settings > Pages**.
    - Under "Source", select **Deploy from a branch**.
    - Select standard branch (usually `main` or `master`) and folder `/ (root)`.
    - Click **Save**.

## Step 2: Get Your Keys & Secrets

You need two things from Google to make this work. Here is the easiest way to get them:

### A. Get Your Google Maps API Key 🔑
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **New Project** (name it something like "Reviews Widget").
3.  Click **"Enable APIs and Services"** (or search for "Places API").
4.  Enable **"Places API (New)"**.
5.  Go to **Credentials**, click **"Create Credentials"** -> **"API Key"**.
6.  **Copy this key.** (It usually starts with `AIza...`).

### B. Get Your Place ID 📍
1.  Go to the [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id).
2.  Search for your business name in the map search bar.
3.  Click on your business pin.
4.  **Copy the Place ID** shown in the pop-up (it looks like a long string of random characters).

### C. Add Them to GitHub Secrets 🔒
1.  Go to your GitHub repository's **Settings** tab.
2.  On the left sidebar, click **Secrets and variables** > **Actions**.
3.  Click the green **New repository secret** button.
4.  Create the first secret:
    -   **Name**: `GOOGLE_PLACES_API_KEY`
    -   **Secret**: (Paste the key from Step A)
5.  Create the second secret:
    -   **Name**: `PLACE_ID`
    -   **Secret**: (Paste the ID from Step B)

## Step 3: First Run

1.  Go to the **Actions** tab.
2.  Select the **"Update Google Reviews"** workflow on the left.
3.  Click the **Run workflow** dropdown and hit the green **Run workflow** button.
4.  Wait for the job to complete (approx. 1-2 minutes).
5.  Verify that a `reviews.json` file has been created in your `public/` (or root) folder.

## Step 4: Embed on Your Website

Add the following code to your website's HTML (works with any framework):

```html
<!-- 1. Include the Component Script -->
<!-- Replace USERNAME and REPO with your GitHub details -->
<script type="module" src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/dist/widget.js"></script>

<!-- 2. Use the Widget -->
<google-reviews-widget 
  src="https://USERNAME.github.io/REPO/reviews.json" 
  theme="light" 
  layout="grid">
</google-reviews-widget>
```
