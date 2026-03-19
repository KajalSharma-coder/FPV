import { Text, View } from "react-native";

export default function Scan() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#020617",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 20 }}>QR Scan (Coming Soon)</Text>
    </View>
  );
}
