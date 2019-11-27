import React, { memo } from "react";
import styled, { css } from "@emotion/native";
import { Text } from "react-native";
import PropTypes from "prop-types";

function SprintButton({ value, index = null, selected = false, onPress }) {
  const isFirst = index === 0;
  const { isCurrent, completeDate, dayLength } = value.__computed;
  return (
    <Sprint
      isFirst={isFirst}
      selected={selected}
      onPress={() => {
        onPress(value.id);
      }}>
      <SprintText numberOfLines={2}>{value.name}</SprintText>
      <DateContainer isCurrent={isCurrent} selected={selected}>
        <DateText isCurrent={isCurrent}>
          {dayLength} Gün ･{" "}
          <Text
            style={css`
              opacity: 0.5;
            `}>
            {completeDate}
          </Text>
        </DateText>
      </DateContainer>
    </Sprint>
  );
}

export default memo(SprintButton);

SprintButton.defaultProps = {
  index: null,
  selected: false
};

SprintButton.propTypes = {
  value: PropTypes.object.isRequired,
  index: PropTypes.number,
  selected: PropTypes.bool,
  onPress: PropTypes.func.isRequired
};

const Sprint = styled.TouchableOpacity(
  (props) => `
  background-color: ${props.selected ? "#ddd" : "#f0f0f0"};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 140px;
  height: 90px;
  padding: 10px;
  margin: 10px 10px 10px ${props.isFirst ? "40px" : "0"};
  cursor: pointer;
`
);
const SprintText = styled.Text`
  font-size: 18px;
  font-family: "Rubik";
`;
const DateContainer = styled.View(
  (props) => `
  background-color: ${props.isCurrent ? "#24c92b36" : props.selected ? "transparent" : "#e5e5e5"};
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 2px 6px;
  border-radius: 10px;
`
);
const DateText = styled.Text(
  (props) => `
  font-size: 10px;
  font-weight: 500;
  color: ${props.isCurrent ? "#007107" : "#000"};
`
);
