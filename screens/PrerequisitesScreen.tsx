import React, {useCallback, useState} from 'react';
import {
  AppStatusBar,
  Button,
  ConnectedLayout,
  Headline,
  Player,
  Recommandation,
  Text,
} from '../components';
import {SESSION} from '../configs/queries';
import {useRoute, useNavigation} from '@react-navigation/native';
import useMmnQuery from '../hooks/useMmnQuery';
import LoadingScreen from './LoadingScreen';
import {useStartSession, useRouting} from '../hooks';
import {colors} from '../assets/style';
import {StyleSheet, View} from 'react-native';

export const PrerequisitesScreen = () => {
  const [showVideo, setShowVideo] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {id}: any = route.params;
  const {goCountdown, goSession, goExercise} = useRouting();
  const startSession = useStartSession();
  const {data, loading} = useMmnQuery(SESSION(id));
  const session = data?.session?.session;
  const video = session?.prerequisiteVideo;

  const handleBack = useCallback(() => {
    goSession(id);
  }, [id, goSession]);

  const handleEndVideo = useCallback(async () => {
    if (session?.countdownVideo) {
      goCountdown(id, true);
    } else {
      const userSession = await startSession(id, true);
      goExercise(
        userSession?.userSessionId,
        userSession?.action?.entity?.id,
        userSession?.action?.entity?.exercise?.id,
        userSession?.action?.entity?.exercise?.video,
        session?.activity?.id,
        session?.id,
        userSession?.action?.entity?.exercise?.needsValidation,
      );
    }
  }, [session, startSession, id, goExercise, goCountdown]);

  if (loading) {
    return <LoadingScreen />;
  }

  return showVideo ? (
    <Player video={video} back={handleBack} end={handleEndVideo} />
  ) : (
    <ConnectedLayout
      bg={colors.pinkD}
      close
      onClose={() => navigation.navigate('Session', {id})}>
      <AppStatusBar />
      <View style={styles.containAlignement}>
        <View style={[{alignItems: 'center'}, styles.containAlignement]}>
          <Recommandation />
          <Headline fontColor="white" center style={styles.headlineStyle}>
            Avant de commencer
          </Headline>
          <Text center mode="body" style={styles.textStyleWidth}>
            Pour r??aliser votre s??ance en toute s??curit?? et conform??ment ?? la
            p??dagogie de Mon Ma??tre Nageur, nous vous alertons sur le fait qu???il
            est imp??ratif d???avoir regard?? les vid??os ????Avant de commencer????
            pr??sentes sur la page de l???activit??.
          </Text>
        </View>
        <Button
          mode="contained"
          color="secondary"
          onPress={() => goCountdown(id, false)}>
          J???ai compris
        </Button>
      </View>
    </ConnectedLayout>
  );
};

const styles = StyleSheet.create({
  root: {},
  containAlignement: {
    width: '100%',
    height: '95%',
    justifyContent: 'center',
  },
  headlineStyle: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  textStyleWidth: {
    maxWidth: 520,
  },
});

export default PrerequisitesScreen;
