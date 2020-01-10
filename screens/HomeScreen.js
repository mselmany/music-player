import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/native";
import * as MediaLibrary from "expo-media-library";

const { MediaType, SortBy } = MediaLibrary;

export default function HomeScreen() {
  const [granted, setGranted] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    (async () => {
      if (await grantPermission()) {
        const { assets: _assets } = await MediaLibrary.getAssetsAsync({
          first: 100,
          mediaType: [MediaType.audio],
          sortBy: [[SortBy.modificationTime, false]]
        });
        setAssets(_assets);
      }
    })();
  }, [grantPermission]);

  const grantPermission = useCallback(async () => {
    const isGranted = await requestMediaLibraryPermissions();
    setGranted(isGranted);
    return isGranted;
  }, []);

  async function requestMediaLibraryPermissions() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === "granted";
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  return (
    <MainContainer>
      <ScrollViewContainer>
        {assets.map((item, index) => (
          // console.log(item);
          // <Header key={index}>{JSON.stringify(item, null, 3)}</Header>
          <Header key={index}>{`${item.filename}`}</Header>
        ))}
      </ScrollViewContainer>
      {!granted ? (
        <Button onPress={grantPermission}>
          <ButtonText>İzin iste</ButtonText>
          <ButtonText>
            Bu uygulamanın Medya Kütüphanesi'ne erişime ihtiyacı var. Aksi taktirde uygulama kullanılamaz!
          </ButtonText>
        </Button>
      ) : null}
    </MainContainer>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

const MainContainer = styled.View`
  display: flex;
  flex-direction: column;
  background-color: #fbfbfb;
  height: 100%;
`;

const Header = styled.Text`
  margin: 40px 0 0 40px;
  font-size: 20px;
  font-family: "Rubik-Light";
`;

const Container = styled.View`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const ScrollViewContainer = styled.ScrollView``;

const Button = styled.TouchableOpacity`
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ButtonText = styled.Text``;
