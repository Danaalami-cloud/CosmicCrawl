module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // NOTE: no explicit reanimated/worklets plugin here on purpose.
    // babel-preset-expo has included the Worklets Babel plugin automatically
    // since Expo SDK 50 — adding "react-native-reanimated/plugin" or
    // "react-native-worklets/plugin" manually on top of that causes
    // "Cannot find module 'react-native-worklets/plugin'" errors. If you're
    // ejecting to the bare React Native Community CLI (no babel-preset-expo),
    // add 'react-native-worklets/plugin' back here as the LAST plugin.
    plugins: [],
  };
};
