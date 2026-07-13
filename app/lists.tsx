import React, { useState, useEffect } from "react";
import { Text, View, Pressable, ScrollView, FlatList, TextInput, Modal } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeBackground from "../components/ThemeBackground";
import { useCrawl } from "../context/CrawlContext";

export default function Lists() {
  const { savedLists, createList, deleteList, loadLists } = useCrawl();
  const [newListName, setNewListName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  const handleCreateList = async () => {
    if (newListName.trim()) {
      await createList(newListName);
      setNewListName("");
      setShowCreateModal(false);
    }
  };

  return (
    <ThemeBackground>
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6 pt-4">
            <View>
              <Text className="text-white text-2xl font-extrabold">My Lists 📋</Text>
              <Text className="text-white/50 text-sm mt-1">{savedLists.length} saved {savedLists.length === 1 ? "list" : "lists"}</Text>
            </View>
            <Pressable onPress={() => router.back()}>
              <Text className="text-white/60 text-2xl">←</Text>
            </Pressable>
          </View>

          {/* Create new list button */}
          <Pressable
            onPress={() => setShowCreateModal(true)}
            className="bg-ufo/20 rounded-full px-6 py-4 items-center border-2 border-dashed border-ufo mb-6"
          >
            <Text className="text-ufo font-bold text-lg">✨ Create new list</Text>
          </Pressable>

          {/* Lists */}
          {savedLists.length === 0 ? (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-5xl mb-4">🗺️</Text>
              <Text className="text-white text-lg font-semibold text-center">No lists yet</Text>
              <Text className="text-white/50 text-center mt-2">Create a list and add your favorite bars!</Text>
            </View>
          ) : (
            <FlatList
              data={savedLists}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/lists/${item.id}`)}
                  className="bg-white/5 rounded-lg p-4 mb-3 border border-white/10"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg">{item.name}</Text>
                      <Text className="text-white/50 text-sm mt-1">
                        {item.bars.length} {item.bars.length === 1 ? "bar" : "bars"}
                      </Text>
                      <Text className="text-white/40 text-xs mt-2">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => deleteList(item.id)}
                      className="bg-plasma/20 rounded-full p-2"
                    >
                      <Text className="text-plasma">🗑️</Text>
                    </Pressable>
                  </View>

                  {/* Bar preview */}
                  {item.bars.length > 0 && (
                    <View className="mt-3 pt-3 border-t border-white/10">
                      {item.bars.slice(0, 2).map((bar) => (
                        <Text key={bar.id} className="text-white/60 text-xs mt-1">
                          • {bar.name}
                        </Text>
                      ))}
                      {item.bars.length > 2 && (
                        <Text className="text-white/40 text-xs mt-1">
                          +{item.bars.length - 2} more
                        </Text>
                      )}
                    </View>
                  )}
                </Pressable>
              )}
            />
          )}
        </ScrollView>

        {/* Create list modal */}
        <Modal transparent animationType="fade" visible={showCreateModal}>
          <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-void rounded-2xl p-6 w-full max-w-sm border border-white/10">
              <Text className="text-white text-xl font-bold mb-4">Create new list</Text>
              <TextInput
                placeholder="Give your list a name..."
                placeholderTextColor="#ffffff40"
                value={newListName}
                onChangeText={setNewListName}
                className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 mb-6"
              />
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/10 rounded-full py-3 items-center"
                >
                  <Text className="text-white/60 font-bold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleCreateList}
                  className="flex-1 bg-ufo rounded-full py-3 items-center"
                >
                  <Text className="text-void font-bold">Create</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeBackground>
  );
}
