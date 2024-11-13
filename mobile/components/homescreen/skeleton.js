import React from "react";
import i18n from "../../translations/i18n";
import { SafeAreaView, ScrollView, Text, View ,RefreshControl, Dimensions,} from "react-native";
import { Skeleton } from "@rneui/themed";
const HomeScreenSkeleton = (refreshState, onRefresh) => {
  height = Dimensions.get("screen")
  return (
    <SafeAreaView className="bg-offwhite flex-1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshState} onRefresh={onRefresh} />
        }
      >
        <Text className="text-[15px] font-semibold text-greydark text-center">
          {i18n.t("errors.pullDownToRefresh")}
        </Text>
        <View className="min-h-[90vw] flex-1 justify-center items-center">
          <Skeleton circle width={height * 0.1} height={height * 0.1} />
        </View>

        <View className="pl-7 pr-7">
          <Skeleton animation="pulse" width={80} height={40} />
          <View className="pt-7" />
          <Skeleton animation="pulse" width="100%" height="20%" />
          <View className="pt-9" />
          <Skeleton animation="pulse" width={80} height={40} />
          <View className="pt-7" />
          <Skeleton animation="pulse" width="100%" height="20%" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreenSkeleton;
