import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "@emotion/native";

import StoreProvider from "./Providers/StoreProvider";
import HomeScreen from "./screens/HomeScreen";

export default function App({ skipLoadingScreen = false }) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !skipLoadingScreen) {
    return (
      <AppLoading startAsync={loadResourcesAsync} onError={console.warn} onFinish={() => setLoadingComplete(true)} />
    );
  } else {
    return (
      <StoreProvider>
        <View>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <HomeScreen />
        </View>
      </StoreProvider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([require("./assets/images/robot-dev.png"), require("./assets/images/robot-prod.png")]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
      "Rubik-Bold": require("./assets/fonts/Rubik-Bold.ttf"),
      Rubik: require("./assets/fonts/Rubik-Regular.ttf"),
      "Rubik-Light": require("./assets/fonts/Rubik-Light.ttf"),
      "WorkSans-Bold": require("./assets/fonts/WorkSans-Bold.ttf"),
      WorkSans: require("./assets/fonts/WorkSans-Regular.ttf"),
      "WorkSans-Light": require("./assets/fonts/WorkSans-Light.ttf")
    })
  ]);
}

const View = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;
