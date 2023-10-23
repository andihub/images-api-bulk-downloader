import { Container, HStack, Heading, Spacer, Text } from "@chakra-ui/react";
import SunMoonLightModeSwitch from "../SunMoonLightModeSwitch";
import Logo from "./Logo";

export const Navbar = () => {
  return (
    <HStack py="4" as="nav" gap="4">
      <Logo></Logo>
      <Heading size={["sm", "md", "lg"]}>
        <Text as="span">
          <Text as="span" color="blue.500">
            I
          </Text>
          mages API bulk{" "}
          <Text as="span" color="blue.500">
            D
          </Text>
          ownloader
        </Text>
      </Heading>
      <Spacer />
      <SunMoonLightModeSwitch />
    </HStack>
  );
};
