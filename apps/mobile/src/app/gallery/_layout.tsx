import { Stack } from "expo-router";

export default function GalleryLayout() {
  return <Stack screenOptions={{ headerShown: true, headerBackTitle: "Gallery" }} />;
}
