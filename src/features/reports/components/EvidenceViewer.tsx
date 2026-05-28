import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Evidence } from '../../../shared/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';

interface EvidenceViewerProps {
  evidences: Evidence[];
}

export function EvidenceViewer({ evidences }: EvidenceViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Evidencia Adjuntada</Text>
      {evidences.length > 0 ? (
        <View style={styles.evidenceWrapper}>
          {evidences.map((ev) => (
            <View key={ev.id} style={styles.imageCard}>
              <TouchableOpacity onPress={() => setSelectedImage(ev.file_url)} activeOpacity={0.9}>
                <Image source={{ uri: ev.file_url }} style={styles.evidenceImage} />
              </TouchableOpacity>
              <Text style={styles.imageFooter} numberOfLines={1}>
                {ev.file_name || 'evidencia.jpg'}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noEvidenceContainer}>
          <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.noEvidenceText}>El ciudadano no adjuntó evidencia fotográfica.</Text>
        </View>
      )}

      {/* Modal para ver imagen en pantalla completa */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={30} color={Colors.textInverse} />
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  evidenceWrapper: {
    marginTop: Spacing.xs,
  },
  imageCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  evidenceImage: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.sm - 2,
    resizeMode: 'cover',
  },
  imageFooter: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  noEvidenceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
  },
  noEvidenceText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});
