import { Contract, JsonRpcProvider } from "ethers";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ===== CONFIG =====
const RPC_URL = "https://testnet-rpc.monad.xyz";
const CONTRACT_ADDRESS = "0x355b8E1e639Dc584405491c0D1b159xxxxxxxx";

const ABI = [
  "function verifyProduct(string) view returns (bool,string,string,string)",
];
// ==================

export default function Verify() {
  const router = useRouter();

  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function verifyProduct() {
    if (!productId.trim()) {
      Alert.alert("Error", "Enter Product ID");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const provider = new JsonRpcProvider(RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const [exists, name, manufacturer, mfgMonth] =
        await contract.verifyProduct(productId.trim());

      if (!exists) {
        setResult({ genuine: false });
      } else {
        setResult({ genuine: true, name, manufacturer, mfgMonth });
      }
    } catch (e) {
      Alert.alert("Error", "Blockchain read failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fake Product Verification</Text>

      <TextInput
        placeholder="Enter Product ID"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        value={productId}
        onChangeText={setProductId}
      />

      <TouchableOpacity style={styles.verifyBtn} onPress={verifyProduct}>
        <Text style={styles.verifyText}>VERIFY</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {result && (
        <View
          style={[
            styles.resultCard,
            { backgroundColor: result.genuine ? "#dcfce7" : "#fee2e2" },
          ]}
        >
          <Text
            style={[
              styles.resultTitle,
              { color: result.genuine ? "#166534" : "#991b1b" },
            ]}
          >
            {result.genuine ? "GENUINE PRODUCT" : "FAKE PRODUCT"}
          </Text>

          {result.genuine && (
            <>
              <Text>Name: {result.name}</Text>
              <Text>Manufacturer: {result.manufacturer}</Text>
              <Text>Mfg Month: {result.mfgMonth}</Text>
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.qrBtn}
        onPress={() => router.push("/scan")}
      >
        <Text style={styles.qrText}>📷 Scan QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 25 }}
        onPress={() => Linking.openURL("https://fpvadmin14.vercel.app")}
      >
        <Text style={styles.adminText}>Admin Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  verifyBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
  },
  verifyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultCard: {
    marginTop: 25,
    padding: 18,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  qrBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#38bdf8",
    padding: 14,
    borderRadius: 12,
  },
  qrText: {
    color: "#38bdf8",
    textAlign: "center",
    fontWeight: "bold",
  },
  adminText: {
    color: "#93c5fd",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
