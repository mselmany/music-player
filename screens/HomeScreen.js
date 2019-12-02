import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/native";
import * as MediaLibrary from "expo-media-library";
import MediaMeta from "react-native-media-meta";

const { MediaType, SortBy } = MediaLibrary;

export default function HomeScreen() {
  const [granted, setGranted] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    grantPermission();
    (async () => {
      const { assets: _assets } = await MediaLibrary.getAssetsAsync({
        first: 100,
        mediaType: [MediaType.audio],
        sortBy: [[SortBy.modificationTime, false]]
      });
      setAssets(_assets);

      MediaMeta.get(_assets[0].uri)
        .then((metadata) => console.log(metadata))
        .catch((err) => console.error(err));

      // console.log(JSON.stringify(_assets, null, 3));
    })();
  }, [grantPermission]);

  const grantPermission = useCallback(async () => {
    setGranted(await requestMediaLibraryPermissions());
  }, []);

  async function requestMediaLibraryPermissions() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const isGranted = status === "granted";
    if (!isGranted) {
      alert("Bu uygulamanın Medya Kütüphanesi'ne erişime ihtiyacı var. Aksi taktirde uygulama kullanılamaz!");
    }
    return isGranted;
  }

  return (
    <MainContainer>
      <ScrollViewContainer>
        {assets.map((item, index) => 
          // console.log(item);
           (
            // <Header key={index}>{JSON.stringify(item, null, 3)}</Header>
            <Header key={index}>{`${item.filename} `}</Header>
          )
        )}
      </ScrollViewContainer>
      {!granted ? (
        <Button onPress={grantPermission}>
          <ButtonText>İzin iste</ButtonText>
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
