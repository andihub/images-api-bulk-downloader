import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Checkbox,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

export interface Image {
  name: string;
  url: string;
  raw: JSON;
}

interface ImageItemProps {
  image: Image;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDownload: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({
  image,
  isSelected,
  onToggleSelect,
  onDownload,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Card align="center">
        <Image
          boxSize="full"
          objectFit="cover"
          src={image.url}
          alt={`Image ${image.name}`}
          borderTopRadius="lg"
          filter={isSelected ? "auto" : "grayscale(100%)"}
        />
        <CardBody>
          <Stack spacing="3">
            <Center>
              <Checkbox isChecked={isSelected} onChange={onToggleSelect}>
                Download
              </Checkbox>
            </Center>
          </Stack>
        </CardBody>

        <CardFooter>
          <ButtonGroup spacing="2">
            <IconButton
              // onClick={toggleRawJSON}
              onClick={onOpen}
              colorScheme="blue"
              variant="ghost"
              aria-label={isOpen ? "Hide JSON" : "Show JSON"}
              icon={<ViewIcon />}
            />
            <IconButton
              colorScheme="blue"
              variant="ghost"
              aria-label="Download"
              onClick={onDownload}
              icon={<DownloadIcon />}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Raw data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(image, null, 2)}
            </pre>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageItem;
