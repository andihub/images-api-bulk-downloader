import { Flex } from "@chakra-ui/react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Main } from "../components/layout/Main";

const App = () => {
  return (
    <Flex direction="column" flex="1" px="16">
      <Navbar />
      <Main />
      <Footer />
    </Flex>
  );
};

export default App;
