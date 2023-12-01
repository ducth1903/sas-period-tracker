import React, { useState, useEffect, useContext, useRef } from "react";
import {
	StyleSheet,
	Text,
	View,
	Pressable,
	SafeAreaView,
	StatusBar,
	ScrollView,
	TouchableOpacity,
	Platform,
	useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Showdown from "showdown";
import RenderHTML from "react-native-render-html";
import { Video, ResizeMode } from "expo-av";
import * as Speech from "expo-speech";

import DynamicNote from "../../components/DynamicNote";
import { SettingsContext } from "../../navigation/SettingsProvider";
import i18n from "../../translations/i18n";
import { AuthContext } from "../../navigation/AuthProvider";

import BackIcon from "../../assets/icons/back.svg";
import SaveInitialIcon from "../../assets/icons/save-initial.svg";
import SaveAfterIcon from "../../assets/icons/save-after.svg";
import SpeakerIcon from "../../assets/icons/speaker.svg";

const ResourceArticle = ({ route, navigation }) => {
	const { outerResource, resource } = route.params;
	const articleKey = resource["articleId"];

	const video = useRef(null);

	const { width } = useWindowDimensions();
	const { selectedSettingsLanguage } = useContext(SettingsContext);
	const { userId } = useContext(AuthContext);

	const [favorited, setFavorited] = useState(false);
	const media = resource[selectedSettingsLanguage].articleMedia;

	const [playingAudio, setPlayingAudio] = useState(false);

	async function isFavorited() {
		try {
			// invariant: favoritedResources[userId] will exist by this point
			const favoritedResources = await AsyncStorage.getItem(
				"favoritedResources"
			);
			const favoritedResourcesObj = JSON.parse(favoritedResources);
			setFavorited(favoritedResourcesObj[userId].includes(articleKey));
		} catch (error) {
			console.log("[ResourceArticle] isFavorited failed: ", error);
		}
	}

	async function handlePressFavorite() {
		let negatedFavorited = !favorited;

		if (negatedFavorited) {
			// add to favorite articles
			try {
				const favoritedResources = await AsyncStorage.getItem(
					"favoritedResources"
				);
				const favoritedResourcesObj = JSON.parse(favoritedResources);
				favoritedResourcesObj[userId].push(articleKey);
				await AsyncStorage.setItem(
					"favoritedResources",
					JSON.stringify(favoritedResourcesObj)
				);
			} catch (error) {
				console.log(
					"[ResourceArticle] adding to favorites failed: ",
					error
				);
			}
		} else {
			// remove from favorite articles
			try {
				const favoritedResources = await AsyncStorage.getItem(
					"favoritedResources"
				);
				const favoritedResourcesObj = JSON.parse(favoritedResources);
				const index = favoritedResourcesObj[userId].indexOf(articleKey);
				if (index > -1) {
					favoritedResourcesObj[userId].splice(index, 1);
				}
				await AsyncStorage.setItem(
					"favoritedResources",
					JSON.stringify(favoritedResourcesObj)
				);
			} catch (error) {
				console.log(
					"[ResourceArticle] removing from favorites failed: ",
					error
				);
			}
		}

		setFavorited(negatedFavorited);
	}

	function markdownToHtml(text) {
		const converter = new Showdown.Converter();
		return converter.makeHtml(text);
	}

	function speakOrPause() {
		if (playingAudio) {
			Speech.stop();
			setPlayingAudio(false);
		} else {
			setPlayingAudio(true);
			Speech.speak(resource[selectedSettingsLanguage].articleTitle, {
				language: selectedSettingsLanguage,
			});
			Speech.speak(resource[selectedSettingsLanguage].articleText, {
				language: selectedSettingsLanguage,
			});
		}
	}

	useEffect(() => {}, [selectedSettingsLanguage]);

	useEffect(() => {
		// init favorited or not
		isFavorited();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={true}>
				<View
					style={
						Platform.OS === "ios" ? { paddingHorizontal: 30 } : {}
					}
				>
					<View style={styles.topBarInline}>
						<TouchableOpacity
							onPress={() => {
								if (outerResource) {
									navigation.navigate("ResourceContent", {
										resource: outerResource,
									});
								} else {
									navigation.navigate("ResourceHomeScreen");
								}
							}}
						>
							<BackIcon style={styles.headerBackIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.headerInline}>
						<Text style={styles.headerText}>
							{resource[selectedSettingsLanguage].articleTitle}
						</Text>
					</View>

					<View style={styles.divider} />

					{media.map((url, index) => {
						console.log(`[ResourceArticle] url: ${url}`);
						return url.endsWith(".mp4") ? (
							<Video
								ref={video}
								source={{ uri: url }}
								style={{
									width: "100%",
									aspectRatio: 16 / 9,
									marginVertical: 20,
								}}
								useNativeControls
								resizeMode={ResizeMode.CONTAIN}
								isLooping
								key={`media-${resource[selectedSettingsLanguage].articleTitle}-${index}`}
							/>
						) : (
							<Image
								source={{ uri: url }}
								style={{ width: "100%", aspectRatio: 16 / 9 }}
							/>
						);
					})}

					<View
						style={{
							marginTop: 20,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<TouchableOpacity
							onPress={() => {
								handlePressFavorite();
							}}
						>
							<View style={{ alignItems: "center" }}>
								{favorited ? (
									<SaveAfterIcon />
								) : (
									<SaveInitialIcon />
								)}
								<Text style={styles.labelText}>
									{i18n.t("education.favorite")}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								flexDirection: "column",
								alignItems: "center",
							}}
							onPress={speakOrPause}
						>
							<SpeakerIcon style={styles.speakerIcon} />
							<Text style={styles.labelText}>
								{i18n.t("education.speak")}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.introText}>
						{/* <Text style={styles.introTextContent}> */}
						<RenderHTML
							contentWidth={width * 0.8}
							tagsStyles={{
								// TODO: Should not use html img tag and instead use media list, but this fix should work for now
								p: {
									...styles.introTextContent,
									marginHorizontal:
										resource[selectedSettingsLanguage]
											.articleMedia.length > 0 ||
										resource[
											selectedSettingsLanguage
										].articleText.includes("img")
											? 20
											: 0,
								},
							}}
							source={{
								html: markdownToHtml(
									resource[selectedSettingsLanguage]
										.articleText
								),
							}}
						/>
						{/* </Text> */}
					</View>
					<View style={styles.noteContainer}>
						<DynamicNote mode="articles" noteKey={articleKey} />
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingVertical: StatusBar.currentHeight,
		paddingHorizontal: 30,
		justifyContent: "center",
		backgroundColor: "#FEFFF4",
	},
	headerText: {
		fontSize: 28,
		fontWeight: "600",
		color: "black",
		textAlign: "left",
		marginTop: 10,
		color: "#5B9F8F",
	},
	divider: {
		backgroundColor: "#EDEEE0",
		height: 4,
		width: "100%",
		marginTop: 10,
		borderRadius: 20,
		alignSelf: "center",
	},
	headerSearchIcon: {
		width: 30,
		height: 30,
		marginTop: 10,
		marginLeft: 30,
	},
	inline: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "left",
		alignItems: "center",
		width: "100%",
	},
	introText: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	introTextContent: {
		fontSize: 15.8,
		fontWeight: "400",
		color: "black",
		textAlign: "left",
	},
	scrollText: {
		fontSize: 17.8,
		fontWeight: "600",
		color: "black",
		textAlign: "center",
		textDecorationLine: "underline",
		marginBottom: 150,
	},
	scrollIcon: {
		width: 20,
		height: 12.43,
		alignSelf: "center",
		marginTop: 15,
	},
	redBox: {
		margin: 20,
		width: 250,
		height: 170,
		backgroundColor: "#FF7F73",
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		marginRight: 5,
	},
	redBoxText: {
		color: "white",
		fontSize: 24,
		fontWeight: "600",
		textAlign: "center",
		width: "80%",
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
		marginLeft: 0,
		marginTop: 20,
		marginBottom: 10,
	},
	purpleBoxText: {
		color: "black",
		fontSize: 15,
		fontWeight: "600",
		textAlign: "center",
		width: "100%",
	},
	topicsList: {
		width: "90%",
		marginLeft: 30,
		marginBottom: 60,
	},
	topBarInline: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		marginTop: StatusBar.currentHeight + 10,
	},
	headerInline: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		marginTop: 15,
	},
	periodImage: {
		width: 200,
		height: 200,
		marginTop: 20,
		marginLeft: 30,
	},
	noteContainer: {
		flex: 1,
		width: "100%",
		marginTop: 40,
		marginBottom: 100,
	},
	labelText: {
		fontSize: 12,
		fontWeight: "400",
		color: "black",
	},
});

export default ResourceArticle;
