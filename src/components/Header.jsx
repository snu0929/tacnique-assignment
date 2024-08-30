// src/components/Header.jsx

import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box bg="teal.500" color="white" p={4}>
      <Heading as="h1" size="lg" textAlign="center">
        User Management Dashboard
      </Heading>
    </Box>
  );
};

export default Header;
