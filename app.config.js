const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.farmus.dev';
  }

  if (IS_PREVIEW) {
    return 'com.farmus.preview';
  }

  return 'com.farmus';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'Farmus (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Farmus (Preview)';
  }

  return 'Farmus';
};

module.exports = {
  expo: {
    name: getAppName(),
    slug: 'farmus',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff',
      },
      package: getUniqueIdentifier(),
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '96eb7eb9-fc1c-444c-9051-70bece90b5e8',
      },
    },
    updates: {
      url: 'https://u.expo.dev/96eb7eb9-fc1c-444c-9051-70bece90b5e8',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
