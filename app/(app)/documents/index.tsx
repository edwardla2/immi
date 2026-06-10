import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DocumentItem } from '@/components/documents/DocumentItem';
import { DocumentSheet } from '@/components/documents/DocumentSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { Colors } from '@/constants/colors';
import { Radius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { useDocuments } from '@/hooks/useDocuments';
import { Document, DocumentCategory, DocumentStatus } from '@/lib/types';

type Filter = 'all' | DocumentStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'needed', label: 'Needed' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'complete', label: 'Complete' },
];

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  identity: 'Identity',
  financial: 'Financial',
  employment: 'Employment',
  education: 'Education',
  legal: 'Legal',
  other: 'Other',
};

const CATEGORY_ORDER: DocumentCategory[] = [
  'identity',
  'financial',
  'employment',
  'education',
  'legal',
  'other',
];

export default function Documents() {
  const insets = useSafeAreaInsets();
  const { documents, create, cycleStatus, remove, refresh } = useDocuments();
  const [filter, setFilter] = useState<Filter>('all');
  const [sheetVisible, setSheetVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const grouped = useMemo(() => {
    const filtered =
      filter === 'all' ? documents : documents.filter((d) => d.status === filter);
    const groups: { category: DocumentCategory; items: Document[] }[] = [];
    for (const category of CATEGORY_ORDER) {
      const items = filtered.filter((d) => (d.category ?? 'other') === category);
      if (items.length > 0) groups.push({ category, items });
    }
    return groups;
  }, [documents, filter]);

  const confirmDelete = (doc: Document) => {
    Alert.alert('Delete document', `Remove "${doc.name}" from your checklist?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(doc.id) },
    ]);
  };

  const showNotes = (doc: Document) => {
    Alert.alert(doc.name, doc.description?.trim() || 'No notes for this document yet.');
  };

  const isEmpty = documents.length === 0;
  const noMatches = !isEmpty && grouped.length === 0;

  return (
    <Screen edges={['top']} padded={false}>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Documents</Text>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isEmpty ? (
        <EmptyState
          icon="documents-outline"
          title="No documents yet"
          body="Start adding the documents you need for your immigration process."
        >
          <PrimaryButton
            label="Add a document"
            onPress={() => setSheetVisible(true)}
            style={styles.emptyButton}
          />
        </EmptyState>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {noMatches ? (
            <Text style={styles.noMatches}>No documents in this filter.</Text>
          ) : (
            grouped.map((group) => (
              <View key={group.category} style={styles.group}>
                <Text style={styles.groupHeader}>{CATEGORY_LABELS[group.category]}</Text>
                {group.items.map((doc, index) => (
                  <Animated.View key={doc.id} entering={FadeInDown.delay(index * 30).duration(250)}>
                    <DocumentItem
                      document={doc}
                      onCycleStatus={() => cycleStatus(doc)}
                      onPress={() => showNotes(doc)}
                      onDelete={() => confirmDelete(doc)}
                    />
                  </Animated.View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {!isEmpty ? (
        <Pressable
          style={[styles.fab, { bottom: insets.bottom + TAB_BAR_CLEARANCE - 20 }]}
          onPress={() => setSheetVisible(true)}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>
      ) : null}

      <DocumentSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSave={async (data) => {
          await create(data);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  filterWrap: {
    marginBottom: Spacing.lg,
  },
  filterRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.borderFocus,
  },
  filterText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.accent,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE + 40,
  },
  group: {
    marginBottom: Spacing.xl,
  },
  groupHeader: {
    ...Typography.labelS,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  noMatches: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.giant,
  },
  emptyButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
