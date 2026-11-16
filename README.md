# Project AURA website

A static, GitHub Pages-ready project website for **Project AURA**, developed by **SUPERCHARGED**. It is based on the supplied presentation script and uses the supplied project and team logos. No build tools, server, sign-in, analytics or API keys are required for the website itself.

The website contains two interactive, standalone AURA digital-twin demos and a downloadable prototype kit. The large wearable image on the homepage is an **AI-generated concept illustration**, not a photograph of the prototype. The genuine build photos, video and letters are intentionally marked “coming soon” until you add them.

## 1. Preview on your computer

Open `index.html` in a browser, keeping all of the files and folders together. Most features also work from the file itself. For a local web server, run the following in this folder and open the printed URL:

```sh
python3 -m http.server 8000
```

The website and demos show simulated examples by default. GitHub Pages is static and cannot run the optional Python bridge; to connect to the ESP32 over Wi-Fi, download the prototype kit and follow its local bridge instructions on your own computer. USB Web Serial also requires a compatible browser, a suitable secure context and explicit user permission. The physical hardware has not been tested.

## 2. Publish on GitHub Pages

1. Download the website ZIP and **extract it** on your computer. Keep all folders and files together.
2. Sign in to [GitHub](https://github.com/). Create a new repository, for example `project-aura`. For GitHub Free, choose a **public** repository for Pages.
3. In the repository, choose **Add file → Upload files**. Upload the **contents of the extracted website folder**, not the ZIP itself and not an extra parent folder. Drag the `assets`, `demo`, and `downloads` folders and the loose files (`index.html`, `styles.css`, `site-content.js`, `app.js`, `README.md`) into GitHub's upload area. Commit the changes to the `main` branch. When done, `index.html` must be visible at the repository's top level, alongside `assets`, `demo` and `downloads`.
4. Open the repository's **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**. Select **main** and **/ (root)**, then click **Save**.
5. Wait for deployment and check the address shown on the Pages settings screen. For a repository named `project-aura`, it will normally be:

   `https://YOUR-GITHUB-USERNAME.github.io/project-aura/`

   Replace the username with your own. GitHub uses a different root URL if your repository is named exactly `YOUR-GITHUB-USERNAME.github.io`.

Official instructions: [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) · [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Upload files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## 3. Add your prototype photos

The file `site-content.js` is the small content editor for the website. You can edit it locally and upload it again, or edit it directly on GitHub using the pencil icon. Each GitHub edit/upload must be **committed**, and Pages may take a little while to update.

1. Upload a photo, for example `build-1.jpg`, into the repository folder `assets/media/`. Keep names simple; paths and capital letters must match exactly.
2. Open `site-content.js` and replace the empty `photos` list with an entry, for example:

```js
  photos: [
    { src: 'assets/media/build-1.jpg', alt: 'Working on the AURA circuit', title: 'Building AURA', caption: 'Testing the first circuit.' },
    { src: 'assets/media/wrist.jpg', alt: 'AURA prototype on a wrist', title: 'On the wrist', caption: 'Trying the wearable form.' }
  ],
```

3. Commit the edited file. Your photos replace the numbered “coming soon” gallery cards in order. Extra photos create extra cards; unfilled spaces remain honest placeholders. Use real alt text and captions that describe your own photos.

## 4. Add a prototype video

Option A: upload a small `.mp4` file into `assets/media/`, then change `video: null,` to:

```js
  video: { type: 'file', url: 'assets/media/aura-demo.mp4', title: 'AURA prototype demonstration' },
```

Option B: upload your video to YouTube and use its actual watch/share URL:

```js
  video: { type: 'youtube', url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID', title: 'AURA prototype demonstration' },
```

Replace `YOUR_VIDEO_ID` with the actual 11-character ID, or paste the complete real YouTube share URL. YouTube videos appear in an embedded player and require network access; make sure your audience is permitted to view the video. GitHub's browser upload is limited to **25 MB per file**, so a video host is often easier for a larger video. Only use videos that you have permission to publish.

## 5. Add LOR, LOA and other documents

1. Check the letters for signatures, personal contact details and any other information that should remain private. A public website is visible to everyone. Get permission before publishing a letter written by someone else.
2. Upload your PDF, for example `lor.pdf`, into `assets/media/`.
3. In `site-content.js`, enter the matching path:

```js
  documents: [
    { title: 'LOR', url: 'assets/media/lor.pdf' },
    { title: 'LOA', url: '' },
    { title: 'Additional project document', url: 'assets/media/project-document.pdf' }
  ]
```

An empty URL remains “COMING SOON”; when a valid path is entered, it becomes a link. Use the exact filename and capitalization. The website cannot confirm that an entered file exists, so test each link after publishing.

## 6. Change text or the hero image

Edit `index.html` for the presentation copy and `styles.css` for the design. The actual team and project logos live in `assets/`. If you replace the concept image with a real photo, update the image `src`, descriptive `alt` text and the visible “AI-illustrated / Not the physical prototype” caption in `index.html` so the page remains truthful.

## Project and safety notes

- AURA is an **experimental prototype**, not a medical device. The score, UV mapping, SpO₂, sensor temperature and alert thresholds are unvalidated. The DS18B20 is not a core-body-temperature sensor.
- The TP4056 is a charger, not a percentage sensor. The optional battery percentage is a voltage-based estimate requiring a verified two-resistor divider. Follow the included hardware guide before making a connection. Switch the load off during charging with the documented simple power setup.
- The website's score examples are simulated. Connected-dashboard alerts require that page to be open; the project does not provide background push notifications.
- The ILO source for the worker-exposure statistic is linked on the page. Mention of SDG 3 does not imply UN endorsement.
- `assets/aura-logo.webp`, `assets/aura-mark.webp`, and `assets/supercharged-logo.webp` are optimized derivatives of the logos supplied for this project. `assets/aura-concept.webp` is an AI-generated illustrative concept. The included DM Sans and Space Grotesk font files are distributed under the SIL Open Font License; license texts are in `assets/fonts/`.
