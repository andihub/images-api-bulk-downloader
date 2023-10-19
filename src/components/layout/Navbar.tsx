import { Container, HStack, Heading, Spacer } from "@chakra-ui/react";
import SunMoonLightModeSwitch from "../SunMoonLightModeSwitch";

export const Navbar = () => {
  return (
    <Container>
      <HStack py="4" as="nav">
        <Heading>Image API bulk downloader</Heading>
        <Spacer />
        <SunMoonLightModeSwitch />
      </HStack>
    </Container>
  );
};
