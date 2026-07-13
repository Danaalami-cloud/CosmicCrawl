import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  Modal,
  TextInput,
  FlatList,
  Animated,
} from "react-native";
import { useCrawl } from "../context/CrawlContext";

interface FloatingListsButtonProps {
  currentBar?: any;
  onBarAdded?: () => void;
}

export default function FloatingListsButton({
  currentBar,
  onBarAdded,
}: FloatingListsButtonProps) {
  const { savedLists, createList, addBarToList, loadLists } = useCrawl();
  const [showPanel, setShowPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const slideAnim = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: showPanel ? 0 : 100,
      useNativeDriver: true,
    }).start();
  }, [showPanel]);

  const handleAddToList = async (listId: string) => {
    if (currentBar) {
      await addBarToList(listId, currentBar);
      setShowPanel(false);
      onBarAdded?.();
    }
  };

  const handleCreateAndAdd = async () => {
    if (newListName.trim() && currentBar) {
      const newList = await createList(newListName);
      await addBarToList(newList.id, currentBar);
      setNewListName("");
      setShowCreateModal(false);
      setShowPanel(false);
      onBarAdded?.();
    }
  };

  if (!currentBar) return null;

  return (
    <>
      {/* Floating button */}
      <Pressable
        onPress={() => setShowPanel(!showPanel)}
        className="absolute bottom-8 right-5 bg-plasma rounded-full p-4 shadow-lg"
        style={{ zIndex: 50 }}
      >
        <Text className="text-2xl">⭐</Text>
      </Pressable>

      {/* Animated side panel */}
      {showPanel && (
        <Modal transparent animationType="none" visible={showPanel}>
          <Pressable
            onPress={() => setShowPanel(false)}
            className="flex-1 bg-black/30"
          >
            <Animated.View
              className="absolute right-0 top-0 bottom-0 bg-void border-l border-white/10 p-5"
              style={{
                width: 280,
                transform: [{ translateX: slideAnim }],
              }}
            >
              <View className="flex-1">
                {/* Header */}
                <View className="mb-4">
                  <Text className="text-white text-lg font-bold">Save to list</Text>
                  <Text className="text-white/50 text-xs mt-1">{currentBar.name}</Text>
                </View>

                {/* Existing lists */}
                {savedLists.length > 0 ? (
                  <FlatList
                    data={savedLists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => handleAddToList(item.id)}
                        className="bg-white/10 rounded-lg p-3 mb-2 border border-white/10"
                      >
                        <Text className="text-white font-semibold text-sm">{item.name}</Text>
                        <Text className="text-white/50 text-xs mt-1">
                          {item.bars.length} bars
                        </Text>
                      </Pressable>
                    )}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                  />
                ) : (
                  <Text className="text-white/50 text-sm text-center py-4">
                    No lists yet
                  </Text>
                )}

                {/* Create new list */}
                <Pressable
                  onPress={() => setShowCreateModal(true)}
                  className="bg-ufo/20 rounded-lg p-3 border border-ufo/30 mt-4"
                >
                  <Text className="text-ufo font-bold text-center text-sm">
                    ✨ New list
                  </Text>
                </Pressable>
              </View>

              {/* Close button */}
              <Pressable
                onPress={() => setShowPanel(false)}
                className="bg-white/10 rounded-full p-2 mt-4 items-center"
              >
                <Text className="text-white">✕</Text>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      )}

      {/* Create list modal */}
      <Modal transparent animationType="fade" visible={showCreateModal}>
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-void rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <Text className="text-white text-lg font-bold mb-4">Create new list</Text>
            <TextInput
              placeholder="List name..."
              placeholderTextColor="#ffffff40"
              value={newListName}
              onChangeText={setNewListName}
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 mb-4"
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowCreateModal(false)}
                className="flex-1 bg-white/10 rounded-full py-2 items-center"
              >
                <Text className="text-white/60 text-sm font-bold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateAndAdd}
                className="flex-1 bg-ufo rounded-full py-2 items-center"
              >
                <Text className="text-void text-sm font-bold">Create & Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
