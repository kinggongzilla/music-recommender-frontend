
#  Music Recommender Frontend

This project is the frontend for the Music Recommender system, built with [Create React App](https://github.com/facebook/create-react-app). It provides the user interface for interacting with the music recommendation engine.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/)
- [GTZAN Music Genre Dataset](http://marsyas.info/downloads/datasets.html) (required for audio playback)

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/music-recommender-frontend.git
   cd music-recommender-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Download the GTZAN Dataset**

   - Download the dataset from [this link](http://marsyas.info/downloads/datasets.html).
   - Extract the contents locally.

4. **Place the Dataset in the Public Folder**

   The dataset must be structured as follows inside the project:

   ```
   public/
   └── gtzan_dataset/
       └── 1/
           └── Data/
               └── genres_original/
                   ├── blues/
                   │   └── blues.00000.wav
                   ├── classical/
                   ├── country/
                   └── ...
   ```

   ✅ **Example of a valid file path:**

   ```
   public/gtzan_dataset/1/Data/genres_original/blues/blues.00000.wav
   ```

5. **Run the frontend development server**

   ```bash
   npm start
   ```

The app will be available at: [http://localhost:3000](http://localhost:3000)


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
