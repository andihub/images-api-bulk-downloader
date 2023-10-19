import React from "react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { IconButton, useColorMode } from "@chakra-ui/react";

const SunMoonLightModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      icon={isDark ? <SunIcon></SunIcon> : <MoonIcon></MoonIcon>}
      onClick={toggleColorMode}
      variant="ghost"
    ></IconButton>
  );
};

export default SunMoonLightModeSwitch;
