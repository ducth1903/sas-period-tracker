import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import SearchIcon from "../../assets/icons/search.svg";
import HistoryIcon from "../../assets/icons/history.svg";
import { ResourceContext } from "../../navigation/ResourcesProvider";
import { SettingsContext } from "../../navigation/SettingsProvider";

const mockData = [
  {
    title: "Menstruation",
    data: [
      {
        key: "1",
        text: "Period Basics",
      },
      {
        key: "2",
        text: "How-to's",
      },
      {
        key: "3",
        text: "Health and Hygiene",
      },
      {
        key: "4",
        text: "Taboos and Misconceptions",
      },
      {
        key: "5",
        text: "Period Basics",
      },
      {
        key: "6",
        text: "How-to's",
      },
      {
        key: "7",
        text: "Health and Hygiene",
      },
      {
        key: "8",
        text: "Taboos and Misconceptions",
      },
    ],
  },
  {
    title: "History",
    data: [
      {
        key: "1",
        text: "Period Basics",
      },
      {
        key: "2",
        text: "How-to's",
      },
      {
        key: "3",
        text: "Health and Hygiene",
      },
    ],
  },
];

const PurpleListItem = ({ item }) => {
  return (
    <View style={styles.purpleBox}>
      <Text style={styles.purpleBoxText}>{item.text}</Text>
    </View>
  );
};

const TitleListItem = (text) => {
    return (
        <View className="justify-center text-center rounded-md py-2 px-4  border-solid border-black bg-purple-400">
            <Text className="">{text}</Text>
        </View>
    )
}

const SectionListItem = (section) => {
    return (
        <View className="justify-center text-center rounded-md py-2 px-4  border-solid border-black bg-purple-400">
            <Text className="">{text}</Text>
        </View>
    )
}

const ArticleListItem = (article) => {
    return (
        <View style={styles.purpleBox}>
          <Text style={styles.purpleBoxText}>{article["articleTitle"]}</Text>
        </View>
      );

}

const ResourceSearch = ({ navigation, props }) => {
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(true);
  const { selectedSettingsLanguage } = useContext(SettingsContext);
  const { globalResources, setGlobalResources } = useContext(ResourceContext);
  const [searchSpace, setSearchSpace] = useState([]);
  const [foundTitles, setFoundTitles] = useState([]);
  const [foundSection, setFoundSections] = useState([]);
  const [foundArticles, setFoundArticles] = useState([]);
  // ../../assets/icons/search.svg

  const handleCancel = () => {
    searchText === "" ? navigation.goBack() : setSearchText("");
    setShowResults(true);
  };

  useEffect(() => {
    if (searchText === "") {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchText]);

  useEffect(() => {
    // define the search space based on the language
    setSearchSpace(globalResources.map((obj) => obj[selectedSettingsLanguage]));
  }, []);

  const handleSearch = (searchText) => {
    console.log(JSON.stringify(searchSpace));
    const titlesArray = [];
    const sectionArray = [];
    const articleArray = [];

    searchSpace.forEach((obj) => {
      titlesArray.push(obj["topicTitle"]);

      obj["sections"].forEach((section) => {
        // Correct property name and `forEach`
        sectionArray.push({
          sectionId: section["sectionId"],
          sectionTitle: section["sectionTitle"],
        });

        section["articles"].forEach((article) => {
          // Correct method name
          articleArray.push({
            articleTitle: article["articleTitle"],
            articleId: article["articleId"],
            articleText: article["articleText"],
          });
        });
      });
    });

    setFoundTitles(
      titlesArray.filter((title) => title.toLowerCase().includes(searchText))
    );
    setFoundSections(
      sectionArray.filter((section) =>
        section["sectionTitle"].toLowerCase().includes(searchText)
      )
    );
    setFoundArticles(
      articleArray.filter(
        (article) =>
          article["articleTitle"].toLowerCase().includes(searchText) ||
          article["articleText"].toLowerCase().includes(searchText)
      )
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.item}>
      <HistoryIcon style={styles.icon} />
      <Text
        style={styles.title}
        onPress={() => {
          setShowResults(false);
          setSearchText(item.text);
        }}
      >
        {item.text}
      </Text>
    </View>
  );

  console.log("searchSpace", searchSpace[0]);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchIcon style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9B9B9B"
            value={searchText}
            // onChangeText={setSearchText}
            onChangeText={(text) => handleSearch(text.toLowerCase())}
          />
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchResultsContainer}>
        {showResults ? (
          <FlatList
            key={"_"}
            data={mockData[1].data}
            numColumns={1}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.searchHistoryContainer}
          />
        ) : (
          <FlatList
            key={"#"}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={mockData[0].data}
            renderItem={({ item }) => <PurpleListItem item={item} />}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: -15 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingLeft: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEEE0",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    height: 50,
  },
  searchIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 10,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: "#FF3522",
    textDecorationLine: "underline",
    fontSize: 14,
  },

  searchResultsContainer: {
    padding: 20,
  },

  purpleBox: {
    margin: 20,
    width: 150,
    height: 150,
    backgroundColor: "#D9D1F7",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginRight: 10,
    marginLeft: 5,
  },
  purpleBoxText: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
  },
  searchHistoryContainer: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    paddingHorizontal: 20,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
  },
});

export default ResourceSearch;
