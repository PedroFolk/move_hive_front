import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type DropdownProps = {
  data: { label: string; value: string }[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function CustomDropdown({
  data,
  value,
  placeholder,
  onChange,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const dropdownRef = useRef<View>(null);

  const normalizeString = (str?: string) =>
    (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    setFilteredData(
      data.filter((item) => normalizeString(item.label).includes(normalizeString(search)))
    );
  }, [search, data]);

  const selectedLabel = data.find((item) => item.value === value)?.label;

  const handleOutsidePress = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <View className="w-full mb-4 relative">
      {open && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View className="absolute inset-0 z-40" />
        </TouchableWithoutFeedback>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setOpen(!open)}
        className={`p-4  rounded-xl border flex-row justify-between items-center ${disabled ? "border-neutral-500 bg-neutral-800" : "border-neutral-600 "
          }`}
        activeOpacity={0.8}


      >
        <Text className={`text-xl ${selectedLabel ? "text-white" : "text-neutral-500"}`}>
          {selectedLabel || placeholder || "Selecione"}
        </Text>

        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="white" />
      </TouchableOpacity>

      {open && (
        <View
          ref={dropdownRef}
          className="absolute top-full left-0 w-full bg-neutral-900 rounded-xl border border-neutral-600 max-h-80 z-50"
        >
          <View className="flex-row items-center border-b border-neutral-600 p-2">
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar..."
              placeholderTextColor="#888"
              className="flex-1 text-white text-lg py-2"
            />
          </View>

          <ScrollView>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={item.value || index}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  setSearch("");
                }}
                className="p-4"
              >
                <Text className="text-white">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>
      )}
    </View>
  );
}
