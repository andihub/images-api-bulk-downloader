import { DownloadIcon, ExternalLinkIcon, ViewIcon } from "@chakra-ui/icons";
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
import React from "react";

export interface Image {
  name: string;
  url: string;
  id: string;
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

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
          onClick={onToggleSelect}
          cursor="pointer"
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
            <IconButton
              colorScheme="blue"
              variant="ghost"
              aria-label="Open in new window"
              onClick={() => openInNewTab(image.url)}
              icon={<ExternalLinkIcon />}
            />
          </ButtonGroup>
        </CardFooter>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Raw data</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
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
