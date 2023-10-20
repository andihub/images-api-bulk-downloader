import { Text, VStack } from "@chakra-ui/react";

export default function AboutInfo() {
  return (
    <VStack gap="2" align="flex-start">
      <Text fontSize="sm">
        This tool loads the JSON content of an API, parses it and extracts the
        image URL, displays all the images and provides the possibility to
        download a single image or download selected images at once as a ZIP
        file.
      </Text>
      <Text fontSize="sm">This software is provided 'as is'.</Text>
    </VStack>
  );
}
