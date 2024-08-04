import React from "react";
import { Link } from "react-router-dom";
import { Box, HStack, Hide } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Box bg="tomato">

      <HStack spacing="10px" >
        <Box m="10px">
          <Link to="/" >Events overview</Link>
        </Box>
        <Hide>
        <Box>
          <Link to="/event/1">Event</Link>
        </Box>
        </Hide>
      </HStack>

    </Box>
  );
};
