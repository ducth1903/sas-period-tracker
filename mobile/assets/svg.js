// Blood Flow Icons
import FlowLightDefault from './icons/blood_flow/light_default.svg';
import FlowMediumDefault from './icons/blood_flow/medium_default.svg';
import FlowHeavyDefault from './icons/blood_flow/heavy_default.svg';
import FlowNoneDefault from './icons/blood_flow/none_default.svg';
import FlowNotSureDefault from './icons/blood_flow/notsure_default.svg';
import FlowLightSelected from './icons/blood_flow/light_selected.svg';
import FlowMediumSelected from './icons/blood_flow/medium_selected.svg';
import FlowHeavySelected from './icons/blood_flow/heavy_selected.svg';
import FlowNoneSelected from './icons/blood_flow/none_selected.svg';
import FlowNotSureSelected from './icons/blood_flow/notsure_selected.svg';

// Mood Icons
import MoodExcitedDefault from './icons/mood/excited_default.svg';
import MoodHappyDefault from './icons/mood/happy_default.svg';
import MoodSensitiveDefault from './icons/mood/sensitive_default.svg';
import MoodSadDefault from './icons/mood/sad_default.svg';
import MoodAnxiousDefault from './icons/mood/anxious_default.svg';
import MoodAngryDefault from './icons/mood/angry_default.svg';
import MoodExcitedSelected from './icons/mood/excited_selected.svg';
import MoodHappySelected from './icons/mood/happy_selected.svg';
import MoodSensitiveSelected from './icons/mood/sensitive_selected.svg';
import MoodSadSelected from './icons/mood/sad_selected.svg';
import MoodAnxiousSelected from './icons/mood/anxious_selected.svg';
import MoodAngrySelected from './icons/mood/angry_selected.svg';
import MoodCustomizeDefault from './icons/mood/custom_mood_default.svg';
import MoodCustomizeSelected from './icons/mood/custom_mood_selected.svg';
// Symptom Icons
import SymptomCravingsDefault from './icons/symptoms/cravings_default.svg';
import SymptomBackacheDefault from './icons/symptoms/backache_default.svg';
import SymptomCrampsDefault from './icons/symptoms/cramps_default.svg';
import SymptomBloatingDefault from './icons/symptoms/bloating_default.svg';
import SymptomTenderDefault from './icons/symptoms/tender_default.svg';
import SymptomHeadacheDefault from './icons/symptoms/headache_default.svg';
import SymptomFatigueDefault from './icons/symptoms/fatigue_default.svg';
import SymptomNauseaDefault from './icons/symptoms/nausea_default.svg';
import SymptomDischargeStringy from './icons/symptoms/discharge_stringy_default.svg';
import SymptomDischargeWatery from './icons/symptoms/discharge_watery_default.svg';
import SymptomDischargeTransparent from './icons/symptoms/discharge_transparent_default.svg';
import SymptomDischargeCreamy from './icons/symptoms/discharge_creamy_default.svg';
import SymptomDischargeClumpy from './icons/symptoms/discharge_clumpy_default.svg';
import SymptomDischargeSticky from './icons/symptoms/discharge_sticky_default.svg';
import SymptomCravingsSelected from './icons/symptoms/cravings_selected.svg';
import SymptomBackacheSelected from './icons/symptoms/backache_selected.svg';
import SymptomCrampsSelected from './icons/symptoms/cramps_selected.svg';
import SymptomBloatingSelected from './icons/symptoms/bloating_selected.svg';
import SymptomTenderSelected from './icons/symptoms/tender_selected.svg';
import SymptomHeadacheSelected from './icons/symptoms/headache_selected.svg';
import SymptomFatigueSelected from './icons/symptoms/fatigue_selected.svg';
import SymptomNauseaSelected from './icons/symptoms/nausea_selected.svg';
import SymptomDischargeStringySelected from './icons/symptoms/discharge_stringy_selected.svg';
import SymptomDischargeWaterySelected from './icons/symptoms/discharge_watery_selected.svg';
import SymptomDischargeTransparentSelected from './icons/symptoms/discharge_transparent_selected.svg';
import SymptomDischargeCreamySelected from './icons/symptoms/discharge_creamy_selected.svg';
import SymptomDischargeClumpySelected from './icons/symptoms/discharge_clumpy_selected.svg';
import SymptomDischargeStickySelected from './icons/symptoms/discharge_sticky_selected.svg';

import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';

const flowSVGs = {
  selected: {
    light: FlowLightSelected,
    medium: FlowMediumSelected,
    heavy: FlowHeavySelected,
    notsure: FlowNotSureSelected,
    none: FlowNoneSelected 
  },
  default: {
    light: FlowLightDefault,
    medium: FlowMediumDefault,
    heavy: FlowHeavyDefault,
    notsure: FlowNotSureDefault,
    none: FlowNoneDefault
  }
};

const dischargeSVGs = {
  selected: {
    stringy: SymptomDischargeStringySelected,
    watery: SymptomDischargeWaterySelected,
    transparent: SymptomDischargeTransparentSelected,
    creamy: SymptomDischargeCreamySelected,
    clumpy: SymptomDischargeClumpySelected,
    sticky: SymptomDischargeStickySelected
  },
  default: {
    stringy: SymptomDischargeStringy,
    watery: SymptomDischargeWatery,
    transparent: SymptomDischargeTransparent,
    creamy: SymptomDischargeCreamy,
    clumpy: SymptomDischargeClumpy,
    sticky: SymptomDischargeSticky
  }
};

// NOTE: Order matters in these objects for the weekly view; they are rendered in order of keys
const symptomSVGs = {
  selected: {
    cravings: SymptomCravingsSelected,
    backache: SymptomBackacheSelected,
    cramps: SymptomCrampsSelected,
    bloating: SymptomBloatingSelected,
    tenderBreasts: SymptomTenderSelected,
    headache: SymptomHeadacheSelected,
    fatigue: SymptomFatigueSelected,
    nausea: SymptomNauseaSelected
  },
  default: {
    cravings: SymptomCravingsDefault,
    backache: SymptomBackacheDefault,
    cramps: SymptomCrampsDefault,
    bloating: SymptomBloatingDefault,
    tenderBreasts: SymptomTenderDefault,
    headache: SymptomHeadacheDefault,
    fatigue: SymptomFatigueDefault,
    nausea: SymptomNauseaDefault
  }
};

const moodSVGs = {
  selected: {
    excited: MoodExcitedSelected,
    happy: MoodHappySelected,
    sensitive: MoodSensitiveSelected,
    sad: MoodSadSelected,
    anxious: MoodAnxiousSelected,
    angry: MoodAngrySelected,
    customize: MoodCustomizeSelected
  },
  default: {
    excited: MoodExcitedDefault,
    happy: MoodHappyDefault,
    sensitive: MoodSensitiveDefault,
    sad: MoodSadDefault,
    anxious: MoodAnxiousDefault,
    angry: MoodAngryDefault,
    customize: MoodCustomizeDefault
  }
};

// TODO: relative fractional/percent width and height inputs
const renderFlow = (flow=null, selected=false, width=40, height=40, mb=0, mr=0) => {
  if (!flow || !Object.keys(flowSVGs.default).includes(flow)) {
    return (
      <View className={`mb-[${mb}] mr-[${mr}]`}>
        <FlowNoneDefault width={width} height={width} />
      </View>
    );
  }

  const FlowIcon = flowSVGs[`${selected ? 'selected' : 'default'}`][flow];
  return (
    <View className={`mb-[${mb}] mr-[${mr}]`}>
      <FlowIcon width={width} height={height} />
    </View>
  );
}

// renders the correct discharge icon, renders default creamy icon if no discharge
const renderDischarge = (discharge=null, selected=false, width=40, height=40, mb=0, mr=0) => {
  if (!discharge || !Object.keys(dischargeSVGs.default).includes(discharge)) {
    return (
      <View className={`mb-[${mb}] mr-[${mr}]`}>
        <SymptomDischargeCreamy width={width} height={height} />
      </View>
    );
  }
  
  const DischargeIcon = dischargeSVGs[`${selected ? 'selected' : 'default'}`][discharge];
  return (
    <View className={`mb-[${mb}] mr-[${mr}]`}>
      <DischargeIcon width={width} height={height} />
    </View>
  );
}

// TODO: Add drop shadow to selected icons
const renderSymptom = (key, symptom, selected=false, width=40, height=40, mb=0, mr=0) => {
  if (!Object.keys(symptomSVGs.default).includes(symptom)) {
    return (
      <View className={`mb-[${mb}] mr-[${mr}]`} key={key}>
        <SymptomCravingsDefault width={width} height={height} />
      </View>
    );
  }
  
  const SymptomIcon = symptomSVGs[`${selected ? 'selected' : 'default'}`][symptom];
  return (
    <View className={`mb-[${mb}] mr-[${mr}]`} key={key}>
      <SymptomIcon width={width} height={height} />
    </View>
  );
}


const renderMood = (key, mood, selected=false, width=40, height=40, mb=0, mr=0) => {
  if (!Object.keys(moodSVGs.default).includes(mood)) {
    return (
      <View className={`mb-[${mb}] mr-[${mr}]`} key={key}>
        <MoodCustomizeDefault width={width} height={height} />
      </View>
    );
  }
  
  const MoodIcon = moodSVGs[`${selected ? 'selected' : 'default'}`][mood];
  return (
    <View className={`mb-[${mb}] mr-[${mr}]`} key={key}>
      <MoodIcon width={width} height={height} />
    </View>
  );
}

export {
  flowSVGs,
  dischargeSVGs,
  symptomSVGs,
  moodSVGs,
  renderFlow,
  renderDischarge,
  renderSymptom,
  renderMood,
  FlowLightDefault,
  FlowMediumDefault,
  FlowHeavyDefault,
  FlowNoneDefault,
  FlowNotSureDefault,
  FlowLightSelected,
  FlowMediumSelected,
  FlowHeavySelected,
  FlowNoneSelected,
  FlowNotSureSelected,
  MoodExcitedDefault,
  MoodHappyDefault,
  MoodSensitiveDefault,
  MoodSadDefault,
  MoodAnxiousDefault,
  MoodAngryDefault,
  MoodExcitedSelected,
  MoodHappySelected,
  MoodSensitiveSelected,
  MoodSadSelected,
  MoodAnxiousSelected,
  MoodAngrySelected,
  MoodCustomizeDefault,
  MoodCustomizeSelected,
  SymptomCravingsDefault,
  SymptomBackacheDefault,
  SymptomCrampsDefault,
  SymptomBloatingDefault,
  SymptomTenderDefault,
  SymptomHeadacheDefault,
  SymptomFatigueDefault,
  SymptomNauseaDefault,
  SymptomDischargeStringy,
  SymptomDischargeWatery,
  SymptomDischargeTransparent,
  SymptomDischargeCreamy,
  SymptomDischargeClumpy,
  SymptomDischargeSticky,
  SymptomCravingsSelected,
  SymptomBackacheSelected,
  SymptomCrampsSelected,
  SymptomBloatingSelected,
  SymptomTenderSelected,
  SymptomHeadacheSelected,
  SymptomFatigueSelected,
  SymptomNauseaSelected,
  SymptomDischargeStringySelected,
  SymptomDischargeWaterySelected,
  SymptomDischargeTransparentSelected,
  SymptomDischargeCreamySelected,
  SymptomDischargeClumpySelected,
  SymptomDischargeStickySelected,
};
