import React from "react";
import styled from "@emotion/native";

import { useStore } from "../Providers/StoreProvider";

import SprintButton from "../components/SprintButton";
import FilterButton from "../components/FilterButton";
import Accordion from "../components/Accordion";
import SearchBar from "../components/SearchBar";

export default function HomeScreen() {
  const { pending, filters, sprints, selecteds, selectFilter, selectSprint } = useStore();

  return (
    <MainContainer>
      <Header>{pending ? "Yükleniyor..." : "Jira Report"}</Header>
      {!pending ? (
        <Container>
          <Accordion header="Filtreler">
            <FilterContainer horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((tag, index) => (
                <FilterButton
                  tag={tag}
                  index={index}
                  selected={selecteds.filter === tag}
                  key={tag}
                  onPress={selectFilter}
                />
              ))}
            </FilterContainer>
          </Accordion>

          <Accordion header="Sprintler">
            <SprintsContainer horizontal showsHorizontalScrollIndicator={false}>
              {sprints
                .filter((s) => (selecteds.filter ? s.__computed.filterTag === selecteds.filter : true))
                .map((value, index) => (
                  <SprintButton
                    value={value}
                    index={index}
                    selected={selecteds.sprint === value.id}
                    key={value.id}
                    onPress={selectSprint}
                  />
                ))}
            </SprintsContainer>
          </Accordion>
        </Container>
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
  font-size: 25px;
  font-family: "Rubik-Light";
`;

const Container = styled.View`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const ScrollViewContainer = styled.ScrollView`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const FilterContainer = styled(ScrollViewContainer)`
  padding: 10px 0;
`;

const SprintsContainer = styled(ScrollViewContainer)`
  padding: 10px 0;
`;
