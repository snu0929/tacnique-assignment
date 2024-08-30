import { Container, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import UserList from "./components/UserList";

function App() {
  return (
    <Box m={0} p={0} boxSizing="border-box">
      <Container maxW="container.full" px={0} py={0}>
        <Header />
        <UserList />
      </Container>
    </Box>
  );
}

export default App;
