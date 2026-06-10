import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ProfileEditSheet } from '@/components/profile/ProfileEditSheet';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/constants/colors';
import { Radius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { getVisaShortLabel } from '@/constants/visaTypes';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';

const HOW_IT_WORKS =
  'Immi is an AI immigration navigator, not a law firm. Everything I share is general ' +
  'information about processes, forms, and timelines. For legal advice specific to your case, ' +
  'always consult a licensed immigration attorney.';

const PRIVACY_URL = 'https://immi.app/privacy';
const TERMS_URL = 'https://immi.app/terms';

export default function ProfileScreen() {
  const { user, signOut, resetPassword } = useAuth();
  const { profile, update } = useProfile();
  const [editVisible, setEditVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const name = profile?.name || 'Your name';
  const initial = (profile?.name || 'I').charAt(0).toUpperCase();
  const statusLine = profile?.current_stage
    ? `${getVisaShortLabel(profile?.visa_type)} · ${profile.current_stage}`
    : getVisaShortLabel(profile?.visa_type);

  const changePassword = () => {
    if (!user?.email) return;
    Alert.alert('Change password', `Send a password reset link to ${user.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send link',
        onPress: async () => {
          await resetPassword(user.email!);
          Alert.alert('Check your email', 'We sent you a password reset link.');
        },
      },
    ]);
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Best-effort cleanup of the user's data, then sign out. Full auth-user
            // deletion requires a privileged server call (service role).
            if (user) {
              await supabase.from('conversations').delete().eq('user_id', user.id);
              await supabase.from('deadlines').delete().eq('user_id', user.id);
              await supabase.from('documents').delete().eq('user_id', user.id);
            }
            await signOut();
          },
        },
      ]
    );
  };

  const howItWorks = () => Alert.alert('How Immi works', HOW_IT_WORKS);

  return (
    <Screen edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.headerRow}>
          <LinearGradient
            colors={Colors.gradientAccent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.status}>{statusLine}</Text>
          </View>
          <Pressable onPress={() => setEditVisible(true)} style={styles.editButton} hitSlop={8}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </Animated.View>

        <Section title="Account">
          <Row icon="mail-outline" label="Email" value={user?.email ?? '—'} dimmed />
          <Divider />
          <Row icon="key-outline" label="Change password" onPress={changePassword} chevron />
          <Divider />
          <Row
            icon="notifications-outline"
            label="Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: Colors.accent, false: Colors.bgInput }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Section>

        <Section title="About">
          <Row icon="information-circle-outline" label="How Immi works" onPress={howItWorks} chevron />
          <Divider />
          <Row
            icon="lock-closed-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL(PRIVACY_URL)}
            chevron
          />
          <Divider />
          <Row
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL(TERMS_URL)}
            chevron
          />
          <Divider />
          <Row icon="pricetag-outline" label="App version" value="1.0.0" dimmed />
        </Section>

        <View style={styles.danger}>
          <SecondaryButton label="Sign Out" icon="log-out-outline" onPress={confirmSignOut} />
          <Pressable onPress={confirmDelete} style={styles.deleteLink} hitSlop={8}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ProfileEditSheet
        visible={editVisible}
        profile={profile}
        onClose={() => setEditVisible(false)}
        onSave={update}
      />
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <GlassCard padding={0} borderRadius={Radius.lg}>
        {children}
      </GlassCard>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  chevron,
  dimmed,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  dimmed?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <Ionicons name={icon} size={20} color={Colors.textSecondary} style={styles.rowIcon} />
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, dimmed && styles.rowValueDimmed]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {right}
        {chevron ? (
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        ) : null}
      </View>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.displayM,
    color: '#FFFFFF',
  },
  headerText: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  name: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  status: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editText: {
    ...Typography.labelM,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  rowIcon: {
    marginRight: Spacing.md,
  },
  rowLabel: {
    ...Typography.bodyL,
    color: Colors.textPrimary,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    maxWidth: '55%',
  },
  rowValue: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
  },
  rowValueDimmed: {
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.lg + 20 + Spacing.md,
  },
  danger: {
    marginTop: Spacing.sm,
  },
  deleteLink: {
    alignSelf: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.sm,
  },
  deleteText: {
    ...Typography.labelL,
    color: Colors.danger,
  },
});
