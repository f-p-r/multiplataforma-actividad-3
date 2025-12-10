# React Native + Expo + TypeScript Project

This is an [Expo](https://expo.dev) project with **TypeScript** and **NativeWind** (Tailwind CSS) support.

## Project Structure

```
├── app/                  # App routes (Expo Router)
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Home screen
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # API services and external integrations
├── constants/          # App constants
└── assets/             # Images, fonts, and other static files
```

## Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Type check your code**

   ```bash
   npm run typecheck
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run typecheck` - Check TypeScript types

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
