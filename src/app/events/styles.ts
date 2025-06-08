// events/styles.ts

import { StyleSheet } from "react-native";

export const ITEM_HEIGHT = 36;
export const PICKER_HEIGHT = 370;
export const IMAGE_SIZE = 100;

const base = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 32, fontWeight: "bold" },
  headerIcons: { flexDirection: "row", gap: 16 },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },

  subtitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: "600",
  },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderTopLeftRadius: 8,
  },
  cardContent: { flex: 1, padding: 12, justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardInfoRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cardInfoText: { fontSize: 12, marginLeft: 4 },
  cardDate: { fontSize: 12, fontWeight: "500", marginTop: 4 },
  cardFooter: {
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cardDesc: { fontSize: 14, marginBottom: 8, lineHeight: 18 },
  cardButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  cardButtonText: { fontWeight: "600" },

  addButton: {
    position: "absolute",
    bottom: 88,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: "90%",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fieldLabel: { fontSize: 16, fontWeight: "500", marginBottom: 4 },

  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownListAbsolute: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    borderWidth: 1,
    borderRadius: 6,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },

  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalBtnCancel: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 12,
  },
  modalBtnSave: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },

  // Time-picker container
  pickerOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "85%",
    height: PICKER_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  pickerWheelRow: { flexDirection: "row", flex: 1, position: "relative" },
  pickerWheel: { flex: 1 },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: { fontSize: 18, color: "#555" },
  pickerTextSelected: { fontWeight: "600", color: "#000" },
  pickerHighlight: {
    position: "absolute",
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  // Calendar container
  calendarContainer: {
    width: "85%",
    height: PICKER_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1, // <— adiciona borda
    borderColor: "#DDD", // <— cor clara
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});

export const darkStyles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#1F1F1F",
    borderColor: "#555",
  },
  pickerText: {
    color: "#DDD",
  },
  pickerTextSelected: {
    color: "#FFF",
  },
  pickerHighlight: {
    borderColor: "#555",
  },
  calendarContainer: {
    backgroundColor: "#1F1F1F",
    borderColor: "#555",
  },
});

export default base;
