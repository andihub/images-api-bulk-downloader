import { Container, Flex, FlexProps } from "@chakra-ui/react";
import { ImageDownloader } from "../ImageDownloader";

export const Main = (props: FlexProps) => {
  return (
    <Flex
      as="main"
      role="main"
      direction="column"
      flex="1"
      boxSize="full"
      {...props}
    >
      <ImageDownloader></ImageDownloader>
    </Flex>
  );
};
