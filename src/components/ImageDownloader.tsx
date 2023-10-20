import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import JSZip from "jszip";
import { type Image } from "../components/ImageItem";
import ImageItem from "./ImageItem";
import AboutInfo from "./AboutInfo";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export function ImageDownloader() {
  const [imageList, setImageList] = useState<JSON[]>([]);
  const [apiUrl, setApiUrl] = useState<string>(
    "https://picsum.photos/v2/list?page={page}&limit={limit}"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [imageUrlProperty, setImageUrlProperty] =
    useState<string>("download_url");
  const [idProperty, setIdProperty] = useState<string>("id");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [page, setPage] = useState<number>();
  const [limit, setLimit] = useState<number>();

  useEffect(() => {
    if (apiUrl && apiUrl.includes("{page}")) {
      setPage(1);
    } else {
      setPage(undefined);
    }

    if (apiUrl && apiUrl.includes("{limit}")) {
      setLimit(50);
    } else {
      setLimit(undefined);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (page) {
      fetchImageList();
    }
  }, [page, limit]);

  const fetchImageList = async () => {
    try {
      setIsFetching(true);
      const apiUrlWithReplacedPlaceholders = apiUrl
        .replace("{page}", String(page ?? ""))
        .replace("{limit}", String(limit ?? ""));
      const response = await fetch(apiUrlWithReplacedPlaceholders);
      if (response.ok) {
        const data: JSON[] = await response.json();
        setImageList(data);
        // Set all images as initially selected
        setSelectedImages(data.map((_, index) => index));
      } else {
        console.error("Failed to fetch JSON data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching JSON data", error);
    } finally {
      setIsFetching(false);
    }
  };

  const downloadImages = async () => {
    setIsDownloading(true);
    setDownloadProgress(1);
    console.log("Starting image downloads...");

    const zip = new JSZip();

    const selectedImagesData = selectedImages.map((index) => imageList[index]);

    for (let index = 0; index < selectedImagesData.length; index++) {
      const item = selectedImagesData[index];
      const image = mapItemToImage(item, index);
      const imageUrl = image.url;

      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const blob = await response.blob();
          zip.file(image.name, blob);
          console.log(`Downloaded image ${index + 1}`);
          setDownloadProgress((index / selectedImagesData.length) * 100);
        } else {
          console.error(`Error downloading image: ${imageUrl}`);
        }
      } catch (error) {
        console.error(`Error downloading image: ${imageUrl}`, error);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const objectURL = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = objectURL;
      a.download = "images.zip";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectURL);

      console.log("Image downloads completed.");
      setIsDownloading(false);
    });
  };

  const downloadImage = (index: number) => {
    const item = imageList[index];
    const image = mapItemToImage(item, index);
    const imageUrl = image.url;

    try {
      const response = fetch(imageUrl);
      response.then(async (res) => {
        if (res.ok) {
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = objectURL;
          a.download = image.name;
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectURL);
          console.log(`Downloaded image ${index + 1}`);
        } else {
          console.error(`Error downloading image: ${imageUrl}`);
        }
      });
    } catch (error) {
      console.error(`Error downloading image: ${imageUrl}`, error);
    }
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(index)
        ? prevSelectedImages.filter((i) => i !== index)
        : [...prevSelectedImages, index]
    );
  };

  const selectAllImages = () => {
    setSelectedImages(imageList.map((_, index) => index));
  };
  const selectNoneImages = () => {
    setSelectedImages([]);
  };

  const mapItemToImage = (item: JSON, index: number) => {
    const id = item.hasOwnProperty(idProperty) ? item[idProperty] : index + 1;

    const image: Image = {
      name: `image${id}.jpg`,
      url: item[imageUrlProperty],
      id,
      raw: item,
    };

    return image;
  };

  return (
    <VStack gap="8">
      <Container>
        <VStack gap="8">
          <AboutInfo />

          <FormControl>
            <FormLabel htmlFor="downloadURL">API download URL:</FormLabel>
            <Input
              type="text"
              id="downloadURL"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              disabled={isDownloading}
            />
            <FormHelperText>
              The URL of the API endpoint where the data should be retrieved
              from. Use placeholders <b>{"{page}"}</b> for enabling paging and{" "}
              <b>{"{limit}"}</b> for enabling limiting.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="imageUrlProperty">
              Image URL property:
            </FormLabel>
            <Input
              type="text"
              id="imageUrlProperty"
              value={imageUrlProperty}
              onChange={(e) => setImageUrlProperty(e.target.value)}
              disabled={isDownloading}
            />
            <FormHelperText>
              The property name from the JSON object which contains the value
              for the image URL.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="idProperty">ID property (optional):</FormLabel>
            <Input
              type="text"
              id="idProperty"
              value={idProperty}
              onChange={(e) => setIdProperty(e.target.value)}
              isDisabled={isDownloading}
            />
            <FormHelperText>
              The property name of the JSON object which contains the value for
              the ID. If no ID exists then the index will be used to name the
              file.
            </FormHelperText>
          </FormControl>

          <Button
            onClick={fetchImageList}
            isLoading={isFetching}
            isDisabled={isDownloading}
          >
            Fetch Images
          </Button>

          <Button
            onClick={downloadImages}
            isDisabled={
              isFetching || isDownloading || selectedImages.length === 0
            }
            isLoading={isDownloading}
            colorScheme="blue"
          >
            Download {selectedImages.length} selected images as ZIP
          </Button>
          {isDownloading && (
            <Box boxSize="full">
              <Progress value={downloadProgress} size="md"></Progress>
            </Box>
          )}

          <HStack boxSize="full">
            {page && (
              <ButtonGroup>
                <Button
                  onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
                  isDisabled={isFetching || isDownloading || page <= 1}
                >
                  <ChevronLeftIcon />
                </Button>

                <NumberInput
                  defaultValue={page}
                  value={page}
                  onChange={(valueAsString: string) => setPage(+valueAsString)}
                  min={1}
                  isDisabled={isFetching || isDownloading}
                  maxW={16}
                >
                  <NumberInputField textAlign="center" paddingInline="2" />
                </NumberInput>
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  isDisabled={isFetching || isDownloading}
                >
                  <ChevronRightIcon />
                </Button>
              </ButtonGroup>
            )}
            <Spacer></Spacer>
            <ButtonGroup>
              <Button
                onClick={() => selectAllImages()}
                isDisabled={
                  isFetching ||
                  isDownloading ||
                  selectedImages.length === imageList.length
                }
              >
                Select all
              </Button>
              <Button
                onClick={selectNoneImages}
                isDisabled={
                  isFetching || isDownloading || selectedImages.length === 0
                }
              >
                Select none
              </Button>
            </ButtonGroup>
            <Spacer></Spacer>
            {limit && (
              <NumberInput
                defaultValue={limit}
                value={limit}
                onChange={(valueAsString: string) => setLimit(+valueAsString)}
                min={1}
                isDisabled={isFetching || isDownloading}
                maxW={24}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )}
          </HStack>
        </VStack>
      </Container>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {imageList.map((item, index) => (
          <ImageItem
            key={index}
            image={mapItemToImage(item, index)}
            isSelected={selectedImages.includes(index)}
            onToggleSelect={() => toggleImageSelection(index)}
            onDownload={() => downloadImage(index)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
