import React, { memo, useState, useCallback } from "react";
import styled, { css } from "@emotion/native";
import PropTypes from "prop-types";
import { Entypo } from "@expo/vector-icons";

function Accordion({ header, children }) {
  const [visible, setVisible] = useState(true);

  const onPress = useCallback(() => {
    setVisible((s) => !s);
  }, []);

  return (
    <AccordionContainer>
      <Accordion.Header visible={visible} onPress={onPress}>
        {header}
      </Accordion.Header>
      <Accordion.Body visible={visible}>{children}</Accordion.Body>
    </AccordionContainer>
  );
}

export default memo(Accordion);

Accordion.defaultProps = {};

Accordion.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

Accordion.Header = memo(({ children, visible, onPress }) => (
  <AccordionHeader onPress={onPress}>
    <AccordionHeaderText>
      {children}
      <Entypo
        name={`chevron-thin-${visible ? "down" : "left"}`}
        size={10}
        color="#bbb"
        style={css`
          margin-left: 5px;
          vertical-align: middle;
        `}
      />
    </AccordionHeaderText>
  </AccordionHeader>
));

Accordion.Header.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

Accordion.Body = memo(({ children, visible }) =>
  visible ? (
    <AccordionBody>
      <AccordionBodyText>{children}</AccordionBodyText>
    </AccordionBody>
  ) : null
);

Accordion.Body.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

const AccordionContainer = styled.View``;

const AccordionHeader = styled.TouchableWithoutFeedback``;

const AccordionHeaderText = styled.Text`
  padding: 20px 5px 5px 40px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #bbb;
  font-family: "Rubik-Light";
`;

const AccordionBody = styled.View``;
const AccordionBodyText = styled.Text``;
