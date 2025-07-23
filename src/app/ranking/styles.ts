import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  backText: {
    fontSize: 18,
    color: "#fff",
  },
  createBtn: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: "100%",
  },
  itemText: {
    fontSize: 18,
    color: "#333",
  },
  rowHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#666",
    paddingBottom: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingVertical: 8,
  },
  cell: {
    fontSize: 16,
    color: "#fff",
  },
  rankCol: {
    width: 40,
    textAlign: "center",
  },
  nameCol: {
    width: 200,
  },
  pointsCol: {
    width: 80,
    textAlign: "right",
  },
});
