import { Button, Text, TextInput, View } from "react-native";

export default function CreateScreen() {
  return (
    <View>
      <Text>Create Post</Text>
      <TextInput placeholder="Name" />
      <TextInput placeholder="Description" />
      <TextInput placeholder="Image URL" />
      <Button title="Submit" />
    </View>
  );
}
