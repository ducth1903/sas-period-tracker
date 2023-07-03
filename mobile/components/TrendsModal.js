

import TrendYearBlock from './TrendYearBlock';
import ScrollPicker from './ScrollPicker';

import BackArrowIcon from '../assets/icons/back_arrow.svg';
import ShareIcon from '../assets/icons/share.svg';
import XIcon from '../assets/icons/x.svg';
import ExportCheckIcon from '../assets/icons/export_check.svg';

const TrendsModal = () => {
    <Modal
        animationIn={"slideInRight"}
        animationOut={"slideOutRight"}
        animationInTiming={500}
        animationOutTiming={500}
        hasBackdrop={false}
        isVisible={trendsModalVisible}
        onRequestClose={() => {
            setTrendsModalVisible(!trendsModalVisible);
        }}
        className="m-0"
    >
        <SafeAreaView className="flex-grow flex-col items-start bg-offwhite">
            <ScrollView className="w-full h-full p-[35px]">
                {/* Header */}
                <View className="flex-row items-center w-full">
                    <Pressable
                        onPress={() => {
                            onEveryPress();
                            setTrendsModalVisible(!trendsModalVisible)
                        }}
                        hitSlop={25}
                    >
                        <BackArrowIcon className="self-start"/>
                    </Pressable>
                    <View className="flex-grow"/>
                    <Text className="text-[32px] font-bold self-center">
                        {i18n.t('analysis.trends.trends')}
                    </Text>
                    <View className="flex-grow"/>
                    <Pressable
                        onPress={() => {
                            onEveryPress();
                            setExportModalVisible(!exportModalVisible);
                        }}
                        hitSlop={25}
                    >
                        <ShareIcon className="self-end"/>
                    </Pressable>
                </View>

                {/* Content */}
                {
                    Object.keys(periodDataByYear).map(year => Number(year))
                                                .sort((a, b) => b - a) // sort by year descending
                                                .map((year) =>
                        {
                            // sort year data by descending first day of period for each month (first day to account for multiple periods same month edge case)
                            return <TrendYearBlock
                                    year={year}
                                    firstPeriodOfNextYear={String(year + 1) in periodDataByYear ? periodDataByYear[year + 1][periodDataByYear[year + 1].length - 1] : null}
                                    yearData={
                                        periodDataByYear[year].sort((periodA, periodB) => {
                                            const getEarliestDateOfPeriod = (period) => {
                                                // first map each day to an array of the dates on which the period occurred, then reduce to get earliest
                                                return period.details.map((dayOfPeriod) => {
                                                    // assuming format YYYY-MM-DD
                                                    const [year, month, day] = dayOfPeriod.dateStr.split('-')
                                                                                                .map(str => Number(str));
                                                    return new Date(year, month - 1, day)
                                                }).reduce((min, curr) => curr < min ? curr : min, new Date());
                                            }

                                            const aDate = getEarliestDateOfPeriod(periodA);
                                            const bDate = getEarliestDateOfPeriod(periodB);
                                            return bDate - aDate;
                                        }).map((period) => { // then sort in-place individual periods by descending date
                                            // sort period.details in-place then just return period
                                            period.details.sort((periodDayA, periodDayB) => {
                                                const [yearA, monthA, dayA] = periodDayA.dateStr.split('-')
                                                                                        .map(str => Number(str));
                                                const [yearB, monthB, dayB] = periodDayB.dateStr.split('-')
                                                                                        .map(str => Number(str));
                                                return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
                                            })
                                            return period;
                                        })
                                    }
                                    key={`trendyearblock-${year}`}/>
                        }
                    )
                }

                {/* Export modal */}
                <Modal
                    animationIn={"slideInUp"}
                    animationOut={"slideOutUp"}
                    animationTiming={500}
                    backdropOpacity={0.5}
                    isVisible={exportModalVisible}
                    onBackdropPress={() => {
                        onEveryPress();
                        setExportModalVisible(!exportModalVisible);
                    }}
                    onRequestClose={() => {
                        onEveryPress();
                        setTrendsModalVisible(!exportModalVisible);
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setExportDropdownOpen(false);
                        }}
                    >
                        <View className="bg-offwhite rounded-[20px] border-[3px] border-seafoam mx-6 py-4 px-6">
                            <View className="flex-row justify-center">
                                <Text className="text-[22px] font-bold">
                                    {i18n.t('analysis.trends.export.export')}
                                </Text>
                                <TouchableOpacity 
                                    className="absolute right-0"
                                    onPress={() => {
                                        onEveryPress();
                                        setExportModalVisible(!exportModalVisible);
                                    }}
                                >
                                    <XIcon/>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row mt-3 items-center justify-between">
                                <Text className="text-[20px] font-bold">
                                    {i18n.t('analysis.trends.export.format')}
                                </Text>
                                <DropDownPicker
                                    open={exportDropdownOpen}
                                    value={exportDropdownValue}
                                    items={exportDropdownItems}
                                    setOpen={setExportDropdownOpen}
                                    setValue={setExportDropdownValue}
                                    setItems={setExportDropdownItems}
                                    placeholder={exportDropdownValue}
                                    style={{backgroundColor: '#EDEEE0', borderWidth: 0, borderRadius: 3, minHeight: 35}}
                                    containerStyle={{width: 90}}
                                    dropDownContainerStyle={{backgroundColor: '#EDEEE0', borderColor: '#777', borderWidth: 1, borderRadius: 3}}
                                    textStyle={{color: '#272727', fontSize: 16, fontWeight: 'bold'}}
                                />
                            </View>

                            <Text className="text-[20px] font-bold mt-3">
                                {i18n.t('analysis.trends.export.start')}
                            </Text>
                            <View className="flex-row mt-3">
                                <ScrollPicker
                                    data={[...Array(12).keys()].map((monthIndex) => {
                                        return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                                    })}
                                    initialScrollIndex={currDateObject.getMonth()}
                                    onViewableItemsChanged={handleViewableItemsChangedStartMonth}
                                    itemHeight={scrollPickerItemHeight}
                                    keyPrefix="month"
                                    roundLeft={true}
                                />
                                <ScrollPicker
                                    data={[...Array(10_000).keys()].map((yearIndex) => {
                                        return {title: yearIndex + 1, id: yearIndex}
                                    })}
                                    initialScrollIndex={currDateObject.getFullYear() - 1}
                                    onViewableItemsChanged={handleViewableItemsChangedStartYear}
                                    itemHeight={scrollPickerItemHeight}
                                    keyPrefix="year"
                                    roundRight={true}
                                />
                            </View>
                            <Text className="text-[20px] font-bold mt-3">
                                {i18n.t('analysis.trends.export.end')}
                            </Text>
                            <View className="flex-row mt-3">
                                <ScrollPicker
                                    data={[...Array(12).keys()].map((monthIndex) => {
                                        return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                                    })}
                                    initialScrollIndex={currDateObject.getMonth()}
                                    onViewableItemsChanged={handleViewableItemsChangedEndMonth}
                                    itemHeight={scrollPickerItemHeight}
                                    keyPrefix="month"
                                    roundLeft={true}
                                />
                                <ScrollPicker
                                    data={[...Array(10_000).keys()].map((yearIndex) => {
                                        return {title: yearIndex + 1, id: yearIndex}
                                    })}
                                    initialScrollIndex={currDateObject.getFullYear() - 1}
                                    onViewableItemsChanged={handleViewableItemsChangedEndYear}
                                    itemHeight={scrollPickerItemHeight}
                                    keyPrefix="year"
                                    roundRight={true}
                                />
                            </View>

                            {/* Export Button */}
                            <Pressable
                                onPress={() => {
                                    setExportButtonPressed(true);
                                    setExportButtonColor("#5B9F8F");
                                    setTimeout(() => {
                                        // TODO: Check for success in sending email to user
                                        setExportModalVisible(false);

                                        // letting modal fly out before setting variables to ensure animation fluidity
                                        setTimeout(() => {
                                            setExportButtonColor("#00394E");
                                            setExportButtonPressed(false);
                                        }, 1000);
                                    }, 1000);
                                }}
                            >
                                <View 
                                    className="flex-row rounded-[50px] justify-center items-center mt-4 py-4 px-6"
                                    style={{ backgroundColor: exportButtonColor }}
                                >
                                    {
                                        exportButtonPressed
                                        &&
                                        <View className="mr-3">
                                            <ExportCheckIcon width={25} height={25} />
                                        </View>
                                    }
                                    <View className="justify-center items-center h-[25px]">
                                        <Text className="text-offwhite text-[16px]">
                                            {exportButtonPressed ? i18n.t('analysis.trends.export.exportedSuccessfully') : i18n.t('analysis.trends.export.export')}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>

                    </Pressable>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    </Modal>
}

export default TrendsModal;