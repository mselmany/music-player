import React, { memo } from "react";
import styled from "@emotion/native";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";

function FilterButton({ tag, index = null, selected = false, onPress }) {
  const isFirst = index === 0;

  return (
    <Filter
      isFirst={isFirst}
      selected={selected}
      onPress={() => {
        onPress(tag);
      }}>
      {selected ? (
        <Close>
          <Ionicons name={`${Platform.OS === "ios" ? "ios" : "md"}-checkmark`} size={10} color="#000" />
        </Close>
      ) : null}
      <Text selected={selected}>{tag || "Hepsi"}</Text>
    </Filter>
  );
}

export default memo(FilterButton);

FilterButton.defaultProps = {
  index: null,
  selected: false
};

FilterButton.propTypes = {
  tag: PropTypes.string.isRequired,
  index: PropTypes.number,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired
};

const Filter = styled.TouchableOpacity`
  background-color: ${(props) => (props.selected ? "#f0f0f0" : "transparent")};
  border-radius: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin: 0 10px 0 ${(props) => (props.isFirst ? "40px" : "0")};
`;

const Text = styled.Text`
  font-size: 10px;
  font-family: "Rubik";
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${(props) => (props.selected ? "#000" : "#bbb")};
`;

const Close = styled.View`
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 10px;
`;
