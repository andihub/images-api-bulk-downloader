import { Container, HStack, Heading, Spacer, Text } from "@chakra-ui/react";
import SunMoonLightModeSwitch from "../SunMoonLightModeSwitch";
import Logo from "./Logo";

export const Navbar = () => {
  return (
    <Container>
      <HStack py="4" as="nav">
        <Logo></Logo>
        <Heading size={["sm", "md"]}>
          <Text as="span" >
            <Text as="span"  color="blue.500">I</Text>mages API bulk <Text as="span"  color="blue.500">D</Text>ownloader
          </Text>
        </Heading>
        <Spacer />
        <SunMoonLightModeSwitch />
      </HStack>
    </Container>
  );
};
